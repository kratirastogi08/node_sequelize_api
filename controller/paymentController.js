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
   // console.log(session)
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

const webhook=async(req,res,next)=>{
  console.log("res",req)
  let signingSecret="whsec_8067fe04e43a0d9147de614b2126f8ecf4deda64e0faff55766507cf8241370a"
  const payload=req.body
  const sig=req.headers['stripe-signature']
  let event;
  try{
       event=stripe.webhooks.constructEvent(payload,sig,signingSecret)
       console.log(event)
  }
  catch(err)
  {
     console.log(err.message)
    return response.error(res,400,"Failed")
  }
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log("pay",paymentIntent)
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

}

const cardPay= async (req, res, next) => {
  try {
   
    let intent;
    if (req.body.payment_method_id) {
      // Create the PaymentIntent
      console.log("sd",req.body.payment_method_id)
      intent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        description:"jsxvsh",
        payment_method_types: ['card'],
        amount: 1099,
        currency: 'usd',
        shipping: {
          name: 'Jenny Rosen',
          address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
          },
        },
        confirmation_method: 'manual',
        confirm: true
      });
      console.log(intent)
    } else if (req.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        req.body.payment_intent_id
      );
    }
    // Send the response to the client
    console.log(intent)
    res.send(generateResponse(intent));
  } catch (e) {
    // Display error on client
    console.log(e.message)
    return res.send({ error: e.message });
  }
}


const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
};
module.exports={
    stripePayment,
    stripeSubscription,
    pay,
    subs,
    webhook,
    cardPay,
}