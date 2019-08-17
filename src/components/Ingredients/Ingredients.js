import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...state, action.ingredient]
    case 'DELETE':
      return state.filter((ingredient) => {
        return ingredient.id !== action.id
      })
    default:
      throw new Error('SHould not get here')
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients])

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://ingredient-maker-hooks-up.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      setIsLoading(false);
      return response.json();
    }).then((responseData) => {

      // setUserIngredients(prevIngredients => [...prevIngredients, { id: responseData.name, ...ingredient }]);
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    }) // browser function - API
  }

  const filteredIngredientsHandler = useCallback((ingredients) => {
    // setUserIngredients(ingredients)
    dispatch({ type: 'SET', ingredients: ingredients })

  }, [])

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://ingredient-maker-hooks-up.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      // setUserIngredients(prevIngredients => {
      //   let newUserIngredients = prevIngredients.filter((ingredient) => {
      //     if (id === ingredient.id) {
      //       return false
      //     } else {
      //       return true
      //     }
      //   })
      //   return newUserIngredients;
      // })
      dispatch({ type: 'DELETE', id: id })
    }).catch((error) => {
      setError('The Human Civilization is going to ENDDDD')
    })
  }

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {/* Need to add list here! */}
        <IngredientList ingredients={userIngredients} onRemoveItem={(id) => removeIngredientHandler(id)} />
      </section>
    </div>
  );
}

export default Ingredients;
