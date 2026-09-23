import dotenv from "dotenv"
import path from "path"


dotenv.config({
    path:path.join(process.cwd(),".env")
})


export default {
    port:process.env.PORT || 8000,
    database_url:process.env.DATABASE_URL,
    app_url:process.env.app_url,
    bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret:process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
    jwt_access_expire_in:process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expire_in:process.env.JWT_REFRESH_EXPIRES_IN,
    stripe_secret_key:process.env.STRIPE_SECRET_KEY,
    stripe_publishable_key:process.env.STRIPE_PUBLISHABLE_KEY,
    payment_success_url: process.env.PAYMENT_SUCCESS_URL,
    payment_cancel_url: process.env.PAYMENT_CANCEL_URL,
    stripe_webhook_secret:process.env.STRIPE_WEBHOOK_SECRET,
    cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_secret_key:process.env.CLOUDINARY_SECRET_KEY,
    google_client_id:process.env.GOOGLE_CLIENT_ID,
    google_client_secret:process.env.GOOGLE_CLIENT_SECRET,
}