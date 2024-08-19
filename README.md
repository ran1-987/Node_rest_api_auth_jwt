authentication and authorization using JWT


new registration
https://processes.icu/api/auth/register
body-json
{
    "name":"",
    "email":"",
    "password":"",
    "role":""
}

Login
https://processes.icu/api/auth/login
body-json
{
    "email":"",
    "password":""
}

https://processes.icu/api/users/current
hearders
key=>Atherization
value=> accessToken

https://processes.icu/api/auth/refresh-token
https://processes.icu/api/auth/logout

https://processes.icu/api/admin
