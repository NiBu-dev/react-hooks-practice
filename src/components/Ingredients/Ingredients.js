import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import useHttp from '../../hooks/http';

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      console.log('Reducing ADD', action.ingredient)
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
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading,
    error,
    data,
    sendRequest,
    extra,
    reqIdentifier,
    clear } = useHttp()

  useEffect(() => {
    console.log('use Effect data', { isLoading: isLoading, error: error, data: data, extra: extra, reqIdentifier: reqIdentifier })
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: extra })
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...extra } })
    }
  }, [data, extra, reqIdentifier, isLoading, error])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://ingredient-maker-hooks-up.firebaseio.com/ingredients.json',
      'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT');
  }, [sendRequest])

  const filteredIngredientsHandler = useCallback((ingredients) => {
    dispatch({ type: 'SET', ingredients: ingredients })

  }, [])

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(`https://ingredient-maker-hooks-up.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'REMOVE_INGREDIENT')

  }, [sendRequest]) // second argument is an array of dependencies

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={(id) => removeIngredientHandler(id)} />

  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
