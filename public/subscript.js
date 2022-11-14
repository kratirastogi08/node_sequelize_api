const checkout = document.getElementById("checkout-button");

checkout.addEventListener('click', () => {
    fetch('/api/v1/order/subs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            quantity:1,
            lookup_key:'lookupkey'
        })
    }).then(res => {
        if(res.ok) return res.json();
        console.log(res.json)
        return res.json().then(json => Promise.reject(json));
    }).then(({url}) => {
         console.log(url);
        window.location = url;
    }).catch(err => {
        console.error(err)
    });
})