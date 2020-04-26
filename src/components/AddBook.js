import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import { getAuthorsQuery,getBooksQuery, addBookMutation } from '../queries/queries';


class AddBook extends Component {

    state={
        name:'',
        genre:'',
        authorId:''
    }

    displayAuthors(){
        //var data=this.props.data
        var data= this.props.getAuthorsQuery;
      //  console.log(this.props);
        if(data.loading){
            return <option disabled>Chargement auteurs en cours ...</option>;
        }else{
            return data.authors.map(author=>{
                return <option key={author.id} value={author.id}>{author.name}</option>;
            })
        }
    }

     submitForm = e=>{
        e.preventDefault();
       // console.log(this.state)
       this.props.addBookMutation({
           variables:{
               name:this.state.name,
               genre:this.state.genre,
               authorId:this.state.authorId
           },
         //refresh book list from mongo DB
           refetchQueries:[{query:getBooksQuery}]
       });
    }

   render() {
    
       return (
           <form id="add-book" onSubmit={this.submitForm}>
               <div className="field">
                    <label>Titre du livre :</label>
                    <input type="text" onChange={(e)=>this.setState({name:e.target.value})}/>
               </div>

               <div className="field">
                    <label>Genre :</label>
                    <input type="text" onChange={(e)=>this.setState({genre:e.target.value})}/>
               </div>

               <div className="field">
                    <label>Auteur :</label>
                    <select onChange={(e)=>this.setState({authorId:e.target.value})}>
                            <option>Selectionner un auteur</option>
                            {this.displayAuthors()}
                    </select>
                </div>

                <button type="submit">+</button>
           </form>
       )
   }
}

//export default graphql(getAuthorsQuery)(addBookMutation)(AddBook);//we bind this query to this component

export default compose(
    graphql(getAuthorsQuery,{name:"getAuthorsQuery"}),
    graphql(addBookMutation,{name:"addBookMutation"})
)(AddBook);