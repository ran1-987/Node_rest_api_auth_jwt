authentication and authorization using JWT


new registration
http://3.133.143.154/api/auth/register
body-json
{
    "name":"",
    "email":"",
    "password":"",
    "role":""
}

Login
http://3.133.143.154/api/auth/login
body-json
{
    "email":"",
    "password":""
}

http://3.133.143.154/api/users/current
hearders
key=>Atherization
value=> accessToken

http://3.133.143.154/api/auth/refresh-token
http://3.133.143.154/api/auth/logout

http://3.133.143.154/api/admin
