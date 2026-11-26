---
title: "Limit order books and the microstructure under a trade"
description: "How a limit order book works, what price-time priority means, and why the shape of the book matters for how prices actually move — with a pointer to a small educational order-book demo I built."
pubDate: 2026-11-26
category: quant-trading
tags: ["quant trading", "market microstructure", "order book", "finance"]
---

A price you see on a screen is not a full description of a market. Under that number is a *limit order book*: a standing set of instructions to buy or sell, at specified prices, that have not yet been matched. Market microstructure is the study of how that book, and the rules for changing it, turn a stream of orders into trades and prices.

This is an explainer of those mechanics. It is not a trading strategy, and it does not report performance numbers.

## What lives in the book

A *limit order* says: buy (or sell) a given quantity, at a given price or better, and rest in the book until it is filled or cancelled. A *market order* says: buy or sell now, against whatever liquidity is already there. In a continuous electronic market, the engine's job is to match these instructions according to published rules.

The book has two sides:

- **Bids** — buy orders, stacked from the highest price downward.
- **Asks** (or offers) — sell orders, stacked from the lowest price upward.

The *best bid* is the highest price someone is currently willing to pay. The *best ask* is the lowest price someone is currently willing to accept. The difference is the *bid–ask spread*. A tighter spread, all else equal, means you pay less to cross the market. The *mid price* is often taken as the midpoint of those two quotes. It is a convenient reference, not a price you can necessarily trade.

At each price level there is a size, the quantity resting there. The collection of sizes is the *depth* of the book. A book can look tight at the inside quotes and still be thin a few ticks away, which you only discover when a larger order walks through several levels.

## Priority: who gets filled first

A matching engine needs a rule for competing orders. A common one, especially in equities, is *price–time priority*: a better price beats a worse price, and at the same price, the earlier order is filled first. Other markets use different rules, including forms of pro-rata allocation, so it is worth reading the venue's documentation rather than assuming.

Queue position is therefore part of the state. Two orders at the same bid are not equivalent if one arrived a millisecond earlier. A cancelled and replaced order typically goes to the back of its queue. People who make markets care about this because the expected fill, and the risk of being picked off after the world changes, depend on where they sit.

## A few objects that show up constantly

Once you have the book, a handful of derived quantities appear in almost every microstructure discussion:

- **Spread and mid**, already mentioned.
- **Microprice**, sometimes defined as a size-weighted combination of the best bid and ask, so that a heavy bid shifts the reference toward the ask. It is a way to encode imbalance in a single number, not a universally "correct" price.
- **Order-book imbalance**, often the difference between bid and ask depth near the inside, normalized by their sum. It is used as a short-horizon signal, with all the usual caveats about overfitting.
- **Slippage and market impact.** A market order consumes resting size. If it is large relative to the displayed depth, it fills at worse prices as it climbs the book, and it may also change what other participants do next. The first of those is mechanical; the second is a modeling problem.

*Liquidity* in this setting is not a mood. It is the book's ability to absorb orders without a large price change, and it can vanish when the people who were posting limit orders step away.

## Why the sequence matters

The same trade can have different meanings depending on what the book looked like, and on whether the incoming order was a marketable buy, a marketable sell, or a cancellation that removed a visible bid. A print at the ask is, in a simple classification, buyer-initiated; a print at the bid is seller-initiated. That classification is already a model, and it gets murkier in more complicated order types, but the underlying point stands: prices move because of a sequence of events, not because a mid price decided to change.

This is also why simulations are useful for learning the mechanics. You can watch a bid appear, get joined by other size, get hit by a market sell, and see the mid and the spread respond, without first having to deal with a production data feed.

I built a small browser-based [order-book and arbitrage demo](https://github.com/tejas-ml/orderbook) for that purpose. It is a static educational app — a virtual order book and a second view for arbitrage — and it runs at [tejas-ml.github.io/orderbook](https://tejas-ml.github.io/orderbook/). It is not a backtest, and I am not attaching fill-quality, latency, or profit numbers to it, because the repo does not contain those results. If you want to see the basic objects above on a screen, that is the place to click around.

For a systematic treatment of the theory, a widely used starting point is Foucault, Pagano, and Röell, *Market Liquidity: Theory, Evidence, and Policy*. Maureen O'Hara's *Market Microstructure Theory* is the older classic. I am pointing to textbooks here, not to any result of my own.
