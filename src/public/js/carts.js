const API_URL = 'http://localhost:8080/api';
function putIntoCart(_id) {
  const cartInfoElement = document.querySelector('.cartId');
  const cartId = cartInfoElement?.id;
  if (cartId === undefined) {
    window.location.href = 'http://localhost:8080/auth/login';
  }

  fetch(`http://localhost:8080/api/carts/${cartId}/products/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(`Producto con el id: ${_id} se agregó al cart con id: ${cartId}`);
    })
    .catch((err) => console.log(err));
}