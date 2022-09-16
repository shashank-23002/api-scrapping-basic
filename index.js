// Importing axios from axios module and parse function from node-html-parser
var axios = require("axios");
const {JSDOM}=require("jsdom");
var { parse } = require("node-html-parser");
const getProductUrl = (product_id)=>`https://www.amazon.com/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`;

async function getPrices(product_id)
{
  const productUrl=getProductUrl(product_id)
  const {data:html}=await axios.get(productUrl,{
    headers:{
      Accept: 'text/html,*/*',
      Host: 'www.amazon.com',
      'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      Pragma:'no-cache',
    }
  });

  const dom=new JSDOM(html)
  const lazy=(selector) => dom.window.document.querySelector(selector);
  const title=lazy('#aod-asin-title-text').textContent;

  const getOffer=(element)=>{
  const price=element.querySelector('.a-price .a-offscreen').textContent.trim();
  return{
    price,
  };
}

  const pinnedElement=lazy('#pinned-de-id');
  const offerlistElements=lazy('#aod-offer-list')
  const offerElements=offerlistElements.querySelectorAll('.aod-information-block');
  const offers=[];

  offerElements.forEach((offerElement)=>{
    offers.push(getOffer(offerElement))
  });

  const result={
    title,
    pinned: getOffer(pinnedElement),
    offers,
  };
  console.log(result)
}
getPrices("B0002E4Z8M")