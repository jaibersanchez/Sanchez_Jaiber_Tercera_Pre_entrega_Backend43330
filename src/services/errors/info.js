export const generateUserErrorInfo = (title, description, price, thumbnail, code, stock, category, status = true) => {
    return `One or more proporties were incomplete or not valid.
        List of required proporties:
        * title : needs to be a String, received "${title}"
        * description : needs to be a String, received "${description}"
        * price : needs to be a Number, received "${price}"
        * thumbnail : needs to be a URL, received "${thumbnail}"
        * code : needs to be a String, received "${code}"
        * stock : needs to be a Number, received "${stock}"
        * category : needs to be a String, received "${category}"
        * status : needs to be a Boolean, received "${status}"`;
  };