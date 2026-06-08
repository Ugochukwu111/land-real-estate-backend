

export default function isAdminMiddleware(req, res, next) {

  if (req.user && req.user.role === 'admin' ){
    next();
  }else{
    console.log(req.user || 'not a user')
    return  res.status(403).json({message: 'Access denied , Admin Only'})
  }
 

}
