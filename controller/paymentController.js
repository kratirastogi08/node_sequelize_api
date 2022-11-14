const response  = require("../CommonResponse/response");
const db = require("../db/db.config.js");
const Users = db.users;
const Products=db.products;
const stripe=require("stripe")('sk_test_51M0NEkSCv9Xi8MdA0RbkYymWj29nf5tw6DNgoQN4yPHLfkYhhjv4KGF1qo0MIPzlewDXc4c38HUNjGG5ypNLDGuw00ellrj7F0')

const stripePayment=async(req,res,next)=>{
     try{
        console.log(req.body)
        const myPayment = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: req.body.amount,
            currency: "inr",
            metadata: {
              company: "Ecommerce",
              integration_check:"accept_a_payment"
            },
          });
         
     const data={client_secret:myPayment.client_secret}
     response.success(res,200,"Payment succeeded",data)
     } 
     catch(err)
     {
     response.error(res,400,err.name)
     }
}

const stripeSubscription= async (req, res, next) => {
  try{
    const {email,payment_method}=req.body;
    const customer=await stripe.customers.create({
      payment_method:payment_method,
      email:email,
      invoice_settings:{
        default_payment_method:payment_method
      }
    })
  
    const subscription=await stripe.subscriptions.create({
       customer: customer.id,
       items:[{price:"price_1M1Q8NSCv9Xi8MdAfA1nMryH"}],
       payment_settings:{
        payment_method_options:["card"],
        save_default_paymemt_method:"on_subscription",   
       },
       expand:["latest_invoice.payment_intent"]
    })
    const status=subscription['latest_invoice']['payment_intent']['status']
    const client_secret=subscription['latest_invoice']['payment_intent']['client_secret']
    res.json({status:status, client_secret:client_secret})
  }
  catch(err)
  {
       res.send(err)
  }
  

}

const pay=async(req,res,next)=>{
  try{
    const product=await Products.findOne({where:{id:req.body.productId}})
    const user=await Users.findOne({where:{id:req.body.userId}})
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      customer_email:user.email,
      line_items: [{
        price_data: {
          currency: 'INR',
          product_data: {
              name: product.title
          },
          unit_amount: product.price*100
      },
      quantity: req.body.quantity
      }],
      mode: 'payment',
      success_url: `http://localhost:5001/success.html`,
      cancel_url: `http://localhost:5001/cancel.html`,
      
    });
    console.log(session)
   return res.json({url:session.url})
    
  }
  catch(err)
  {
     console.log(err)
  }
  
}

const subs= async (req, res, next) => {
  const prices = await stripe.prices.list({
    lookup_keys: ['lookupkey'],
    expand: ['data.product'],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `http://localhost:5001/success.html`,
    cancel_url: `http://localhost:5001/cancel.html`,
  });
  console.log(session)
  return res.json({url:session.url})
}
module.exports={
    stripePayment,
    stripeSubscription,
    pay,
    subs
}