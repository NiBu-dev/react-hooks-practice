import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);


  const addIngredientHandler = ingredient => {
    fetch('https://ingredient-maker-hooks-up.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      return response.json();
    }).then((responseData) => {
      setUserIngredients(prevIngredients => [...prevIngredients, { id: responseData.name, ...ingredient }]);

    }) // browser function - API
  }

  const removeIngredientHandler = id => {
    setUserIngredients(prevIngredients => {
      let newUserIngredients = prevIngredients.filter((ingredient) => {
        if (id === ingredient.id) {
          return false
        } else {
          return true
        }
      })
      return newUserIngredients;
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        {/* Need to add list here! */}
        <IngredientList ingredients={userIngredients} onRemoveItem={(id) => removeIngredientHandler(id)} />
      </section>
    </div>
  );
}

export default Ingredients;
