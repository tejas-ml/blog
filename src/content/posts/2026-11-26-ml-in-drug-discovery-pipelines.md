---
title: "How machine learning shows up in a drug discovery pipeline"
description: "A map of a standard small-molecule discovery pipeline, the jobs machine learning is actually asked to do along it, and a short look at related formulation problems in areas such as cosmetics."
pubDate: 2026-11-26
category: industry-biochem
tags: ["drug discovery", "biotech", "machine learning", "formulation"]
---

Drug discovery is often drawn as a funnel: a biological target, a pile of candidate molecules, a smaller set of "leads," then preclinical studies, then clinical trials. The drawing is too neat — stages overlap, programs jump backward, and many projects die — but it is still the right scaffold for asking where machine learning actually sits.

I do not work at a pharmaceutical or cosmetics company, and I am not reporting results from a discovery program. This is a map of the standard pipeline, and of the jobs ML is commonly asked to do inside it.

## A standard small-molecule outline

A typical small-molecule program, in very coarse steps:

1. **Target identification and validation.** Choose a protein, pathway, or phenotype worth modulating, and gather evidence that modulating it could matter in disease.
2. **Hit finding.** Search a chemical space — a physical library, a virtual library, or a set of generated structures — for starting molecules that have some desired activity.
3. **Lead optimization.** Modify a hit to improve potency, selectivity, and a bundle of properties loosely grouped as ADMET (absorption, distribution, metabolism, excretion, and toxicity), while remaining chemically tractable.
4. **Preclinical and clinical evaluation.** Animal and then human studies, under a regulatory process that is not optional and is not a modeling exercise.

Each stage is expensive, and attrition is the rule rather than the exception. Computation is attractive here for a simple reason: most ideas you could test in a lab, you will never have time or material to test. The useful question is not "can a model replace the assay?" It is "can a model help you choose better experiments?"

## Where machine learning is used

**On the biology side.** Models are used to prioritize targets from genetic associations, expression atlases, perturbation screens, and literature. This is closer to computational biology than to chemistry: the object is a gene or a pathway, and the failure modes are familiar (confounded cohorts, batch effects, a correlation that is not a mechanism).

**On the chemistry side, at hit finding.** *Quantitative structure–activity relationships* (QSAR) and later representation-learning models try to predict activity from molecular structure. *Virtual screening* ranks large libraries, sometimes after or alongside physics-based docking. Generative models propose new structures under constraints (a pharmacophore, a synthetic-accessibility score, a property range). All of these are only as good as the data and the chemical space they were built on. Activity cliffs — very similar molecules with very different activity — are a known way these models fail.

**On properties and developability.** Predicting solubility, permeability, metabolic stability, or liability for a particular toxicity is often as important as predicting the on-target assay. A potent molecule that cannot be made, stored, or absorbed is not a drug. These property models are widely used, and they need the same skepticism as any other predictor: domain of applicability, leakage between train and test, and experimental error in the labels.

**On structure.** Protein structure prediction changed the practical starting point for many structure-based efforts. AlphaFold 2, described by Jumper et al. in *Nature* in 2021, is the public landmark most people mean when they say this. A predicted structure is not the same thing as a bound complex, and it does not replace experimental structures where those exist, but it did change what is available for the large number of proteins that had no close template.

**In the loop.** The more honest deployments look like a cycle: propose compounds or experiments, measure, update the model, propose again. A model that never sees a wet-lab measurement is a ranking function with an untested error distribution.

## Formulation, including cosmetics and personal care

The same kind of thinking shows up outside the drug funnel, in *formulation*: mixing several ingredients so that the product is stable, safe, and usable. A pharmaceutical chemist cares about this for the medicine itself (a tablet, a solution, a lipid nanoparticle). A cosmetics or personal-care chemist cares about it for creams, lotions, color cosmetics, and related products.

The chemistry is different in detail but familiar in kind. Many leave-on products are emulsions — droplets of oil in water, or water in oil — held by surfactants. Rheology (how the material flows and spreads), pH, preservative systems, oxidation, and temperature history all affect whether the mixture stays together and whether it is acceptable to use. Color and fragrance add further constraints.

Machine learning appears here as property prediction and mixture design: given a recipe, will it separate, feel too heavy, or fail a stability test? Those are regression and constrained-optimization problems on composition space, usually with far less public data than in small-molecule QSAR, and with a lot of protocol dependence. As in drug discovery, the model is a way to suggest which recipes to make next, not a certificate that a product is safe or effective. Safety testing and regulation still sit outside the model.

## What I would keep in mind

Three habits travel well across this whole landscape. First, name the stage: a target-prioritization model and a docking model and a formulation model are not interchangeable. Second, treat chemical and biological data as experimental objects, with batch effects and applicability domains, not as clean labels. Third, keep the wet experiment in the loop. The pipeline is still a laboratory and clinical process; computation changes which of the possible experiments get done.

If you want the AlphaFold 2 paper, it is Jumper, J. et al., "Highly accurate protein structure prediction with AlphaFold," *Nature* 596, 583–589 (2021).
