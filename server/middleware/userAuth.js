import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if (!token) {
        return res.json({
            success: false,
            message: 'not Authorized, login Again'
        })
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        
        if (tokenDecode.id){
            const userId = req.user;
            req.user = tokenDecode.id;
           
        }else{
            return res.json({
                success: false,
                message: 'not authorized login again'
            })
        }

        
        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export default userAuth;