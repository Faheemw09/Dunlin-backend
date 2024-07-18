
const language=require("@google-cloud/language")
require("dotenv").config()



const client=new language.LanguageServiceClient({
    keyFilename:process.env.GOOGLE_APPLICATION_CREDENTIALS
})

module.exports= client