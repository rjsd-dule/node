import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar= document.querySelector('#eliminar-proyecto'); 

if (btnEliminar) {
		btnEliminar.addEventListener('click',e =>{
        const urlProyecto =e.target.dataset.proyectoUrl;
		Swal.fire({
		  title: 'Desea borrar el Proyecto',
		  text: "No se podra recuberar al eliminar",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Si, Deseo eliminar!',
		  CancelButtonText:'No , Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				
                const url=`${location.origin}/proyectos/${urlProyecto}`;
				axios.delete(url,{params:{urlProyecto}}) 
				     .then(function(respuesta){
                   console.log(respuesta);
                      Swal.fire(
					      respuesta.data,
					      'Eliminado con exito',
					      'success'
			           );
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
	});
}

export default btnEliminar;