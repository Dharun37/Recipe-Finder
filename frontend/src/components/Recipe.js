import React, { useState, useEffect } from 'react';
import API_URL from '../config';

function Recipe() {
  const [ingredients, setIngredients] = useState('');
  const [recipeOptions, setRecipeOptions] = useState([]);
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

  const searchRecipes = async () => {
    if (!ingredients.trim()) {
      alert('Please enter ingredients (comma-separated).');
      return;
    }
    const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&apiKey=${apiKey}&number=5&ranking=1`;

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        setRecipeOptions(data);
        setCurrentRecipe(null);
      } else {
        alert('No recipes found with those ingredients!');
        setRecipeOptions([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Something went wrong. Please try again.');
      setRecipeOptions([]);
    }
  };

  const getRecipeDetails = async (recipeId, title, image) => {
    try {
      const instructionsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
      const instructionsResponse = await fetch(instructionsUrl);
      const instructionsData = await instructionsResponse.json();

      const fullInstructions = instructionsData.instructions || "No instructions available.";

      setCurrentRecipe({
        id: recipeId,
        title: title,
        image: image,
        instructions: fullInstructions,
      });
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      alert('Could not load recipe details.');
    }
  };

  const clearCurrentRecipe = () => {
    setCurrentRecipe(null);
    setRecipeOptions([]);
  };

  const saveRecipe = async () => {
    if (!currentRecipe) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to save recipes.');
        return;
      }

      const response = await fetch(`${API_URL}/recipes`, {
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

      const response = await fetch(`${API_URL}/recipes`, {
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

      const response = await fetch(`${API_URL}/recipes/${id}`, {
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
    <div className="container" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Recipe Generator</h1>
      <label htmlFor="ingredients" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Enter ingredients you have (comma-separated):</label>
      <input
        type="text"
        id="ingredients"
        placeholder="e.g., chicken, rice, tomatoes"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{ width: 'calc(100% - 22px)', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '12px', transition: 'border-color 0.3s ease' }}
      />
      <button
        type="button"
        onClick={searchRecipes}
        style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease', width: '100%', marginBottom: '10px' }}
      >
        Search Recipes
      </button>

      {recipeOptions.length > 0 && !currentRecipe && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#2c3e50' }}>Recipe Options (click to view details):</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {recipeOptions.map((recipe) => (
              <div 
                key={recipe.id} 
                onClick={() => getRecipeDetails(recipe.id, recipe.title, recipe.image)}
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e8f4f8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img src={recipe.image} alt={recipe.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#34495e' }}>{recipe.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Missing ingredients: {recipe.missedIngredientCount} | Used: {recipe.usedIngredientCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentRecipe && (
        <>
          <button
            type="button"
            onClick={() => setCurrentRecipe(null)}
            style={{ backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '8px 16px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', marginBottom: '10px' }}
          >
            ← Back to Results
          </button>
          <button
            type="button"
            onClick={saveRecipe}
            style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '12px 20px', fontSize: '16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease', width: '100%', marginBottom: '10px' }}
          >
            Save Recipe
          </button>

          <div id="recipe" style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fafafa' }}>
            <h2 id="recipe-title" style={{ marginTop: 0, color: '#34495e' }}>{currentRecipe.title}</h2>
            <div id="recipe-image" style={{ textAlign: 'center' }}>
              <img src={currentRecipe.image} alt={currentRecipe.title} style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
            </div>
            <div id="instructions" style={{ marginTop: '20px', lineHeight: 1.6, fontSize: '15px', color: '#555' }}>
              <strong>Instructions:</strong>
              <p>{currentRecipe.instructions}</p>
            </div>
          </div>
        </>
      )}

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
