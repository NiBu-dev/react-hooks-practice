import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

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

const httpReducer = (state, action) => {
  switch (action.type) {
    case 'SEND_REQUEST':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...state, loading: null }
    case 'ERROR':
      return { loading: false, error: action.errorData }
    case 'CLEAR':
      return { ...state, error: null }
    default:
      throw new Error('Should not be reached');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })


  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients])

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND_REQUEST' })
    fetch('https://ingredient-maker-hooks-up.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      dispatchHttp({ type: 'RESPONSE' })
      return response.json();
    }).then((responseData) => {
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    }) // browser function - API
  }, [])

  const filteredIngredientsHandler = useCallback((ingredients) => {
    dispatch({ type: 'SET', ingredients: ingredients })

  }, [])

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttp({ type: 'SEND_REQUEST' })
    fetch(`https://ingredient-maker-hooks-up.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' })
      dispatch({ type: 'DELETE', id: id })
    }).catch((error) => {
      dispatchHttp({ type: 'Error', errorData: 'Something went really wrong' })
    })
  }, []) // second argument is an array of dependencies

  const clearError =  useCallback(() => {
    dispatchHttp({ type: 'CLEAR' })
  }, [])

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={(id) => removeIngredientHandler(id)} />

  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
