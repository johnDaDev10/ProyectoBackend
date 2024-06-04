import mongoose from 'mongoose'

const URLDB =
  'mongodb+srv://johndev10admin:jd7yfGAHIKOjdaDG1R2024lv@e-commercejdlv-cluster.irmfbff.mongodb.net/EcommerceJDLV-DB?retryWrites=true&w=majority&appName=e-commerceJDLV-Cluster'

mongoose
  .connect(URLDB)
  .then(console.log('Connected to the database.'))
  .catch((error) => console.log('Error by dbConfig ', error))
