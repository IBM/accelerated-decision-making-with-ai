# Gatsby Theme Carbon Starter

## What is this?

> Gatsby [themes](https://www.gatsbyjs.org/docs/themes/) encapsulate all of the
> configuration and implementation details of Gatsby websites. This is a
> starter-kit (boilerplate) with a dependancy on the `gatsby-theme-carbon`
> package. The primary goal of `gatsby-theme-carbon` is to get content authors
> speaking the IBM Design Language with Carbon as soon as possible. It includes
> some sample components/content demos in the `src/pages` directory.

## How do I use it?

Check out our quick
[getting started](https://gatsby-theme-carbon.now.sh/getting-started) guide and
video!

`gatsby-theme-carbon` at it’s core relies on [mdx](https://mdxjs.com/) for page
creation. Check out the `src/pages` directory for some examples for using mdx.

A key feature of Gatsby themes is component shadowing. By simply placing a
component into the `src/gatsby-theme-carbon/components` location, you can
override components used by the theme. You can read more about component
shadowing
[here](https://www.gatsbyjs.org/docs/themes/api-reference#component-shadowing).

You’re also free to make your own components and use them in your MDX pages.

## What’s Next?

[Check out the docs!](https://gatsby-theme-carbon.now.sh)

##  Developer
1. Clone the repo using either `git clone git@github.com:IBM/accelerated-decision-making-with-ai.git` 
or `git clone https://github.com/IBM/accelerated-decision-making-with-ai.git` depending on whether you prefer
SSH or HTTPS respectively.
1. `cd ADMAI`
1. `cd Website` to change directory to the gatsby directory and `npm install` to install dependencies
1. Make your changes in this directory and commit and push them after testing and/or running local with 
`npm run dev`. Travis CI will deploy to the gh-pages when you merge your 
pr to main branch. Website link is [here](https://ibm.github.io/accelerated-decision-making-with-ai/)

NB: For this to work ensure you are using node version not less than v12.18.3 

