export class userDTO {
    constructor(user) {
      this.email = user.email;
      this.isAdmin = user.isAdmin;
      this.cartID = user.cart;
    }
  }