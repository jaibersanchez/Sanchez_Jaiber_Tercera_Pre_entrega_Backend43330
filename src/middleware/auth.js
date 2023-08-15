/******************************* Session isAdmin *******************************/
export function isAdmin(req, res, next) {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización' });
}

/******************************* Session isUser *******************************/
export function isUser(req, res, next) {
  if (req.session?.email) {
    return next();
  }
  return res.status(401).render('error', { error: 'Error de autenticación' });
}

export function isNotAdmin(req, res, next) {
  if (req.session?.role !== 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización' });
}

export const isCartOwner = (req, res, next) => {
  if (req.session?.cart === req.params.cid) {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};