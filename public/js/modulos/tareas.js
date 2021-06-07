import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizar} from '../funciones/avance';
const tareas=document.querySelector('.listado-pendientes');

if (tareas){

    tareas.addEventListener('click',(e) => {
    	if(e.target.classList.contains('glyphicon-ok')){
    	   const icon=e.target;
    	   const idtarea=icon.parentElement.parentElement.parentElement.parentElement.dataset.tarea;
    	   const url=`${location.origin}/tareas/${idtarea}`

           axios.patch(url,{idtarea})
           .then(function (request){
           	  if(request.status===200)
           	  	{window.location.href = `/proyectos/woocommerce-con-worpres-ZyRfj07vU` }
           	  actualizar();
           });
    	}

    	if(e.target.classList.contains('glyphicon-trash')){
    	   const tareaHtml=e.target.parentElement.parentElement.parentElement.parentElement,
    	         idtarea=tareaHtml.dataset.tarea;
           Swal.fire({
		  title: 'Desea borrar la tarea',
		  text: "No se podra recuberar al eliminar",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, Deseo eliminar!',
		  CancelButtonText:'No , Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				
                const url=`${location.origin}/tareas/${idtarea}`
				axios.delete(url,{params:{idtarea}}) 
				     .then(function(respuesta){
                   console.log(respuesta);
                     if(respuesta.status==200){
                     	tareaHtml.parentElement.removeChild(tareaHtml);
                     	console.log('okkk');
                     }
                      Swal.fire(
					      respuesta.data,
					      'Eliminado con exito',
					      'success'
			           );
                      actualizar();
				})
				.catch(()=>{
					Swal.fire({
						type:'error',
						title:'error de servidor',
						text:'No se pudo eliminar el proyecto'
					});
				})
			    
			    
			  }
		})
    	}
        
    });
}

export default tareas;