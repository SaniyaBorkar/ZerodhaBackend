require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

const HoldingsModel  = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const UsersModel = require("./model/UsersModel");
const {userVerification} = require("./middlewares/AuthMiddleware");
// const BidsModel = require("./model/BidsModel");
// const AsksModel = require("./model/AsksModel");




const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", authRoute);

// app.use(cors());


// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

// app.get("/allHoldings", async (req, res) => {
//   let allHoldings = await HoldingsModel.find({});
//   res.json(allHoldings);
// });

// app.get("/allPositions", async (req, res) => {
//   let allPositions = await PositionsModel.find({});
//   res.json(allPositions);
// });

app.post("/newOrder", async (req, res) => {
  console.log("sell hit");
  const { name, qty, price, mode, userId } = req.body;
  console.log(userId);
  try {
    // Save the new order
    const newOrder = new OrdersModel({ name, qty, price, mode, userId });
    await newOrder.save();

    // Handle BUY or SELL mode
    if (mode === "BUY") {
      const result = await BuyMode(name, qty, price, userId);
      if (!result.success) {
        return res.status(400).send(result.message);
      }
    } else if(mode === "SELL"){
      console.log("sell2");
      const result = await SellMode(name, qty, price, userId);
      
      if (!result.success) {
        return res.status(400).send(result.message);
      }
    }
    console.log("order placed");
    res.send("Order processed successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the order.");
  }
});

async function BuyMode(name, qty, price, userId) {
  console.log("buy Mode inputs:", { name, userId });
  try {
    const user = await UsersModel.findById(userId);

    // Check if the user has sufficient funds
    const totalCost = qty * price;
    if (user.funds < totalCost) {
      console.log("insufficient funds");
      return { success: false, message: "Insufficient funds for this purchase." };
    }

    // Deduct the funds
    user.funds -= totalCost;
    await user.save();

    // Add the new holding
    const newHolding = new HoldingsModel({ name, qty, price, userId });
    await newHolding.save();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred while buying." };
  }
}

async function SellMode(name, qty, price, userId) {
  console.log("SellMode inputs:", { name, userId });

  try {
    // Fetch all holdings of the user for the given stock name
    const holdings = await HoldingsModel.find({ name, userId }); // Sort by _id for consistent processing order
    console.log(holdings);
    // Calculate the total quantity available for the stock
    const totalAvailableQty = holdings.reduce((sum, holding) => sum + holding.qty, 0);

    // Check if the user has sufficient quantity to sell
    if (totalAvailableQty < qty) {
      return { success: false, message: "Insufficient holdings to sell." };
    }

    // Deduct the selling quantity from holdings iteratively
    let remainingQtyToSell = qty;
    for (const holding of holdings) {
      if (remainingQtyToSell <= 0) break;

      if (holding.qty <= remainingQtyToSell) {
        // If holding can be fully used to cover the remaining quantity
        remainingQtyToSell -= holding.qty;
        await HoldingsModel.deleteOne({ _id: holding._id }); // Delete the holding completely
      } else {
        // If holding can partially cover the remaining quantity
        holding.qty -= remainingQtyToSell;
        await holding.save(); // Update the holding with the reduced quantity
        remainingQtyToSell = 0;
      }
    }

    // Add the revenue from selling to the user's funds
    const totalRevenue = qty * price; // Calculate revenue
    const user = await UsersModel.findById(userId);
    user.funds += totalRevenue;
    await user.save();

    return { success: true, message: "Sell order processed successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred while processing the sell order." };
  }
}

app.get("/investments/:userId", async (req, res) => {
  console.log("new point hit");
  const { userId } = req.params;
  console.log(userId);

  try {
    // Fetch user holdings
    const holdings = await HoldingsModel.find({ userId });
    const user = await UsersModel.findById(userId);
    // Calculate total investment and current value
    let totalInvestment = 0;
    let currentValue = 0;

    for (const holding of holdings) {
      totalInvestment += holding.qty * holding.price; // Purchase price
      currentValue += holding.qty * holding.avg;
    }

    // Calculate profit and loss
    const profitLoss = currentValue - totalInvestment;

    // Add mock data for margins and balances
    const openingBalance = 50000; // Default or fetched from a user profile
    const marginsUsed = 0.1 * openingBalance; // Example: 10% of the opening balance
    const marginAvailable = openingBalance - marginsUsed;

    // Return response
    res.json({
      totalInvestment,
      currentValue,
      profitLoss,
      marginAvailable,
      marginsUsed,
      openingBalance,
      user,
    });
  } catch (error) {
    console.error("Error fetching investment data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/fetchFunds/:userId", async(req,res)=>{
  try{
    const {userId} = req.params;
    console.log("Received userId:", userId);
    const user = await UsersModel.findById(userId);
    
    return res.status(200).json(user.funds);
  }catch (error) {
    console.error("Error funding", error);
    res.status(500).json({ error: "Internal server error" });
  }
  
})

app.post("/addFunds", async (req,res)=>{
  
  try{
    const userId = req.body.userId;
    const addFunds = req.body.amount;
    const user = await UsersModel.findById(userId);
    console.log("Amount Type:", typeof req.body.amount); // Debugging
    console.log("fund type:", typeof user.funds);  
    user.funds += addFunds;
    user.save();
    res.status(200).json(user.funds); 

  }catch (error) {
    console.error("Error funding", error);
    res.status(500).json({ error: "Internal server error" });
  }
  
});

app.post("/withdrawFunds", async(req,res)=>{
  try{
    const userId = req.body.userId;
    const withdrawFunds = req.body.amount;
    const user = await UsersModel.findById(userId);
    user.funds -= withdrawFunds;
    user.save();
    res.status(200).json(user.funds); 

  }catch (error) {
    console.error("Error funding", error);
    res.status(500).json({ error: "Internal server error" });
  }
})




// app.post("/newOrder", async (req, res) => {
//   const {name, qty, price, mode, userId} = req.body
//   let newOrder = new OrdersModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     mode: req.body.mode,
//     userId: req.body.userId,
//   });

//   newOrder.save();

//   if(mode === "BUY"){
//     BuyMode(name, qty, price, userId);
//   }
//   else{
//     SellMode(name, qty, price, userId);
//   }

//   res.send("Order saved!");
// });

// async function BuyMode(name, qty, price, userId){
//   const newHolding = await HoldingsModel({
//     name: name,
//     qty: qty,
//     price: price,
//     userId: userId
//   })

//   newHolding.save();

//   const user = await UsersModel.findById(userId);
//   const totalCost = user.funds - qty*price;
//   await UsersModel.findByIdAndUpdate({userId}, {$set: {funds: totalCost}});
  
// }

// async function SellMode(name, qty, price, userId){

//   const holding = await HoldingsModel.findOneAndDelete({name, qty, userId})
//   const user = await UsersModel.findById(userId);
//   const totalCost = user.funds + qty*price;
//   await UsersModel.findByIdAndUpdate({userId}, {$set: {funds: totalCost}});
  
// }

// async function flipBalance ( userId1, userId2, quantity, price, name){
    
//     const user1 = await UsersModel.findById(userId1);
//     const user2 = await UsersModel.findById(userId2);

//     const totalCost = quantity*price;

//     const UpdatedFunds1 = user1.funds + totalCost;
//     const UpdatedFunds2 = user2.funds - totalCost;

//     await UsersModel.findOneAndUpdate({_id: userId1}, {$set: {funds: UpdatedFunds1}})
//     await UsersModel.findOneAndUpdate({_id: userId2}, {$set: {funds: UpdatedFunds2}})

//     const holdings1 = await HoldingsModel.find({name}, {userId: userId1});
//     for (let holding of holdings1){
//       if(holding.qty > quantity){
//         const UpdatedQty1 = holding.qty - quantity;
//         if(UpdatedQty1 != 0){
//           await HoldingsModel.findOneAndUpdate({name: name}, {userId: userId1}, {qty: holding.qty}, {$set: {qty: UpdatedQty1}});
//         }
//         else{
//           await HoldingsModel.findOneAndDelete({name: name}, {userId: userId1}, {qty: holding.qty});
//         }
//       }
//     }
    
//     const newHolding = await HoldingsModel({
//       name: name,
//       price: price,
//       userId: userId2,

//     })
  
// }

// async function fillOrders(name, price, quantity, userId, mode) {

//   let remainingQuantity = quantity;

//   if (mode === "BUY") {

//     const asks = await AsksModel.find({ name }).sort({ price: 1 });

//     for (let ask of asks) {
//       if (ask.price > price) {
//         continue;
//       }

//       const buyer = await UsersModel.find(userId);

//       if (ask.qty > remainingQuantity) {
//         const cost1 = price*remainingQuantity;
//         if(buyer){
//           if(buyer.funds < cost1){
//             return -1;
//           }
//         }
//         const UpdatedAskQty = ask.qty - remainingQuantity;
//         const newAsk = await AsksModel.find(ask._id);
//         if(newAsk){
//           await AsksModel.findOneAndUpdate({_id: ask._id}, {$set: {qty: UpdatedAskQty}});
//         }
//         flipBalance(ask.userid, userId, remainingQuantity, ask.price);
//         return 0;
//       } else {
        
//         remainingQuantity -= ask.qty;
//         const cost2 = ask.qty*price;
//         if(buyer){
//           if(buyer.funds < cost2){
//             return -1;
//           }
//         }
//         flipBalance(ask.userId, userId, ask.qty, ask.price);
//         await AsksModel.deleteOne({ _id: ask._id });
//       }
//     }
//   } else {

//     const holdings = await HoldingsModel.find({ name, userId });

//     // Calculate the total quantity available for selling
//     const totalAvailableQty = holdings.reduce((sum, holding) => sum + holding.qty, 0);

//     // Check if user has enough assets to sell
//     if (totalAvailableQty < quantity) {
//       return -2; // Indicate insufficient assets
//     }

//     // Fetch bids sorted by price (descending) to match with asks
//     const bids = await BidsModel.find({ name }).sort({ price: -1 });

//     for (let bid of bids) {
//       if (bid.price < price) {
//         continue;
//       }

//       if (bid.qty > remainingQuantity) {
//         const UpdatedBidQty = bid.qty - remainingQuantity;
//         const newBid = await BidsModel.find(bid._id);
//         if(newBid){
//           await BidsModel.findOneAndUpdate({_id: bid._id}, {$set: {qty: UpdatedBidQty}});
//         }
//         flipBalance(userId, bid.userId, remainingQuantity, price);
//         return 0;
//       } else {
//         remainingQuantity -= bid.qty;
//         flipBalance(userId, bid.userId, bid.qty, price);
//         await BidsModel.deleteOne({ _id: bid._id });
//       }
//     }
//   }

//   return remainingQuantity; // Return the remaining quantity if not fully filled
// }



// app.post("/newHolding", async (req, res) => {
//   let newHolding = new HoldingsModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     avg: req.body.avg,
//     price: req.body.price,
//     net: req.body.net,
//     day: req.body.day,
//     userId: req.body.userId
//   });

//   newHolding.save();
//   console.log("holding saved");
//   res.send("holding saved!");
// });

app.post("/allHoldings", async (req, res) => {
  const { userId } = req.body; // Extract userId from the request body

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const holdings = await HoldingsModel.find({ userId }).exec(); // Query holdings by userId
    res.status(200).json(holdings); // Send holdings as response
  } catch (error) {
    console.error("Error retrieving holdings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// app.post("/addBid", async (req,res)=>{
//   console.log("endpoint hit");
//   let newBid = new BidsModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     userId: req.body.userId
//   });

//   newBid.save();
//   res.send("bid saved");

// })

// app.post("/addAsk", async (req,res)=>{
//   let newAsk = new AsksModel({
//     name: req.body.name,
//     qty: req.body.qty,
//     price: req.body.price,
//     userId: req.body.userId
//   });

//   newAsk.save();
//   res.send("ask saved");

// })

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});