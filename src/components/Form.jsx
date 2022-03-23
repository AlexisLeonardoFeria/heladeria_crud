import React, { useEffect, useState } from "react";
import "./Form.css";
import Sale from './Sale'
import db from "../.firebase.config";
import { collection, addDoc,getDocs,doc,deleteDoc, updateDoc} from "firebase/firestore";
import logo from '../assets/icon.webp'


function Form() {
  const [sale, setSale] = useState({
    categorie: "",
    flavor: "",
    price: 0,
    quantity: 0,
    total:0
  });

  const [list,setList]=useState([])

  useEffect(()=>{
    getData()
  },[])

  const handleInputChange = (e) => {
    setSale({
      ...sale,
      [e.target.name]: e.target.value,
    });
  };

  const saveData = (e) => {
    e.preventDefault();
    const newSale={
      ...sale,
      total:parseFloat(sale.quantity*sale.price).toFixed(2)
    }
    try {
      if(newSale.id){
        updateDoc(doc(db,"sales",newSale.id),newSale).then(
          ()=>{
              getData()
          window.alert("Elemento editado")
          }
        )
      }else{
        addDoc(collection(db, "sales"), newSale).then(
          ()=>{
            getData()
          window.alert("Elemento agregado")
          }
        )
      }
      
      setSale({
        categorie: "",
        flavor: "",
        price: 0,
        quantity: 0,
        total:0
      })
    } catch (error) {
      console.log(error);
    }
    
  };

  const deleteItem=(id)=>{
    if (window.confirm("Seguro que quieres eliminar este elemento?")===true) {
      try {
      deleteDoc(doc(db,"sales",id))
    .then(()=>{
      // console.log("This items has deleted "+id)
      getData();
      window.alert("Elemento eliminado")
    })
    } catch (error) {
      console.error(error)
    }
    }
  
  }

  const editItem=(id,categorie,flavor,price, quantity, total)=>{
    setSale({
      id:id,
      categorie: categorie,
      flavor: flavor,
      price: price,
      quantity: quantity,
      total:total
    })
  }

  const getData = () => {
    let listItems = [];
    try {
      getDocs(collection(db, "sales"))
        .then((data) => {
          data.forEach((i) => {
            listItems.push({ ...i.data(), id: i.id });
          })
          setList([...listItems])
          // console.log(sale)
        })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container--form" onSubmit={saveData}>
        <form className="form">
          <img className="form--logo" src={logo} alt="logo"/>
          <label className="form--label">Productos</label>
          <select
            className="form--selectInput"
            id="input1"
            name="categorie"
            value={sale.categorie}
            onChange={handleInputChange}
            
          >
            <option value="">Escoje un producto...</option>
            <option value="torta">Torta</option>
            <option value="pasteles">Pasteles</option>
            <option value="galletas">Galletas</option>
            <option value="torta_helado">Torta helado</option>
            <option value="pey">Pey</option>
            <option value="tostadas">Tostadas</option>

          </select>

          <label className="form--label">Sabor</label>
          <select
            className="form--selectInput"
            id="input2"
            name="flavor"
            value={sale.flavor}
            onChange={handleInputChange}
          >
            <option value="">Escoje un sabor...</option>
            <option value="chocolate">Chocolate</option>
            <option value="vainilla">Vainilla</option>
            <option value="menta">Menta</option>
            <option value="--------------">-------------</option>
            <option value="manzana">Manzana</option>
            <option value="piña">Piña</option>
            <option value="---------------">-----------------</option>
            <option value="sal">Sal</option>
            <option value="integral">Integral</option>
          </select>

          <label className="form--label">Costo individual</label>
          <input
            className="form--textInput"
            id="input3"
            type="number"
            name="price"
            step="0.1"
            min="0"
            value={sale.price}
            onChange={handleInputChange}
          />

          <label className="form--label">Cantidad a comprar</label>
          <input
            className="form--textInput"
            id="input4"
            type="number"
            name="quantity"
            min="0"
            value={sale.quantity}
            onChange={handleInputChange}
          />

          {
          sale.categorie === "" || sale.flavor === "" || sale.price === 0 || sale.quantity === 0 ? 
            (
              <button className="form--submitInput disableInput" disabled>
                Enviar
              </button>
            ) : (
              <input className="form--submitInput" type="submit" value="Enviar" />
            )
          }
        </form>
      </div>

      <div className='container--sales'>
      {
        list.map((element)=>(
          <Sale key={element.id} id={element.id} categorie={element.categorie} flavor={element.flavor} price={element.price} quantity={element.quantity} deleteItem={deleteItem} total={element.total} editItem={editItem}
          />
        ))
          // console.log(list)
      }
    </div>
      
    </>
  );
}

export default Form;