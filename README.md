authentication and authorization using JWT


new registration
http://processes.icu/api/auth/register
body-json
{
    "name":"",
    "email":"",
    "password":"",
    "role":""
}

Login
http://processes.icu/api/auth/login
body-json
{
    "email":"",
    "password":""
}

http://processes.icu/api/users/current
hearders
key=>Atherization
value=> accessToken

http://processes.icu/api/auth/refresh-token
http://processes.icu/api/auth/logout

http://processes.icu/api/admin
