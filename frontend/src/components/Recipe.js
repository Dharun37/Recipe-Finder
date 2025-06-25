import React, { useState, useEffect } from 'react';

function Recipe() {
  const [foodItem, setFoodItem] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const apiKey = '158c6e30b81341708c376ad3e70f3db5';

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  };

  const getRecipe = async () => {
    if (!foodItem.trim()) {
      alert('Please enter a food name.');
      return;
    }
    const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${foodItem}&apiKey=${apiKey}&number=1`;

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const recipe = data.results[0];
        const recipeTitle = recipe.title;
        const recipeImageUrl = recipe.image;
        const recipeId = recipe.id;

        const instructionsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
        const instructionsResponse = await fetch(instructionsUrl);
        const instructionsData = await instructionsResponse.json();

        const fullInstructions = instructionsData.instructions || "No instructions available.";

        setCurrentRecipe({
          id: recipeId,
          title: recipeTitle,
          image: recipeImageUrl,
          instructions: fullInstructions,
        });
      } else {
        alert('No recipe found!');
        clearCurrentRecipe();
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      alert('Something went wrong. Please try again.');
      clearCurrentRecipe();
    }
  };

  const clearCurrentRecipe = () => {
    setCurrentRecipe(null);
  };

  const saveRecipe = async () => {
    if (!currentRecipe) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to save recipes.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: getUserIdFromToken(token),
          recipeId: currentRecipe.id,
          title: currentRecipe.title,
          image: currentRecipe.image,
          instructions: currentRecipe.instructions,
        }),
      });

      if (response.ok) {
        alert('Recipe saved!');
        fetchSavedRecipes();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save recipe.');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe. Please try again.');
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSavedRecipes([]);
        return;
      }

      const response = await fetch('http://localhost:5000/api/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const recipes = await response.json();
        setSavedRecipes(recipes);
      } else {
        setSavedRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setSavedRecipes([]);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete recipes.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Recipe deleted.');
        fetchSavedRecipes();
        clearCurrentRecipe();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete recipe.');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe. Please try again.');
    }
  };

  const displayRecipe = (recipe) => {
    setCurrentRecipe(recipe);
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Recipe Generator</h1>
      <label htmlFor="food-item" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Enter food item:</label>
      <input
        type="text"
        id="food-item"
        placeholder="e.g., pizza"
        value={foodItem}
        onChange={(e) => setFoodItem(e.target.value)}
        style={{ width: 'calc(100% - 22px)', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '12px', transition: 'border-color 0.3s ease' }}
      />
      <button
        type="button"
        onClick={getRecipe}
        style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease', width: '100%', marginBottom: '10px' }}
      >
        Get Recipe
      </button>
      <button
        type="button"
        onClick={saveRecipe}
        disabled={!currentRecipe}
        style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '4px', cursor: currentRecipe ? 'pointer' : 'not-allowed', transition: 'background-color 0.3s ease', width: '100%', marginBottom: '10px', opacity: currentRecipe ? 1 : 0.5 }}
      >
        Save Recipe
      </button>

      <div id="recipe" style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fafafa' }}>
        <h2 id="recipe-title" style={{ marginTop: 0, color: '#34495e' }}>{currentRecipe ? currentRecipe.title : '\u00A0'}</h2>
        <div id="recipe-image" style={{ textAlign: 'center' }}>
          {currentRecipe && <img src={currentRecipe.image} alt={currentRecipe.title} style={{ width: '100%', maxWidth: '300px', height: 'auto', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />}
        </div>
        <div id="instructions" style={{ marginTop: '20px', lineHeight: 1.6, fontSize: '15px', color: '#555' }}>
          {currentRecipe && (
            <>
              <strong>Instructions:</strong>
              <p>{currentRecipe.instructions}</p>
            </>
          )}
        </div>
      </div>

      <div id="saved-recipes" style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#2c3e50' }}>Saved Recipes</h3>
        <div id="saved-recipes-list">
          {savedRecipes.length === 0 && <p>No saved recipes.</p>}
          {savedRecipes.map((recipe) => (
            <div key={recipe._id} className="saved-recipe" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ flexGrow: 1 }}>{recipe.title}</span>
              <button onClick={() => displayRecipe(recipe)} style={{ marginLeft: '5px', padding: '5px 10px', fontSize: '14px', width: 'auto' }}>View</button>
              <button onClick={() => deleteRecipe(recipe._id)} style={{ marginLeft: '5px', padding: '5px 10px', fontSize: '14px', width: 'auto' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recipe;
