const stripe = Stripe('pk_test_51M0NEkSCv9Xi8MdA5HprohEDK6Ypme3ucJvG7zVnLWrJIAkpUD71wkj5BXWx5MNicGNuaoURgA3B4PznkClYxu0100rlkceY5k');

const elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form
const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  },
};

const cardElement = elements.create('card', {style});
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  // We don't want to let default form submission happen here,
  // which would refresh the page.
  event.preventDefault();

  const result = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      // Include any additional collected billing details.
      name: 'Jenny Rosen',
    },
  })

  stripePaymentMethodHandler(result);
});

const stripePaymentMethodHandler = async (result) => {
    if (result.error) {
      // Show error in payment form
    } else {
      // Otherwise send paymentMethod.id to your server (see Step 4)
      const res = await fetch('/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method_id: result.paymentMethod.id,
        }),
      })
      const paymentResponse = await res.json();
  
      // Handle server response (see Step 4)
      handleServerResponse(paymentResponse);
    }
  }