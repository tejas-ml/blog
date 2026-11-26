---
title: "Bonding, energy, and the thermodynamics behind molecular modeling"
description: "A primer on chemical bonds, conformational energy, and free energy — the ideas a computational model is approximating when it tries to say whether a molecule is stable or whether two molecules will bind."
pubDate: 2026-11-26
category: chemistry
tags: ["chemistry", "molecular modeling", "thermodynamics", "computational biology"]
---

When a program "docks" a small molecule into a protein, or runs a molecular dynamics trajectory, it is not discovering a new kind of chemistry. It is approximating ideas that are already in a physical-chemistry textbook: atoms are held together by bonds and noncovalent forces, those interactions define an energy landscape, and what we call stability is about free energy, not just a pretty snapshot of a structure.

This post is a primer on those ideas, written from the point of view of someone who uses computation around biology, not from a claim that I have a new force field to announce.

## What holds a molecule together

A *covalent bond* forms when atoms share electrons. Bond lengths and angles cluster around characteristic values; it costs energy to stretch or bend them far from those values. If the two atoms differ in electronegativity, the bond is polar, and the molecule can have a permanent dipole even though it is electrically neutral overall.

Around and between those covalent frameworks sit weaker, often decisive, interactions:

- **Ionic interactions**, or salt bridges, between formally charged groups.
- **Hydrogen bonds**, directional attractions typically between a hydrogen attached to N or O and a nearby acceptor atom. They help explain the structure of water, the base pairing of DNA, and a large part of protein secondary structure.
- **van der Waals attractions**, including London dispersion, which are weaker and shorter-ranged but add up over many contacts.
- The **hydrophobic effect**, which is easy to caricature. Oily groups in water are not mainly pushed by a mysterious attraction to each other; the surrounding water pays an entropic and enthalpic cost when it has to reorganize around them, so compact packing of nonpolar surface is often favored.

In biomolecules, the noncovalent terms are usually the ones that distinguish one fold, one binding pose, or one assembly from another. The covalent bonds define the pieces; the weaker interactions decide how the pieces sit.

## Energy as a function of shape

Once you accept that every arrangement of the atoms has an energy, you can think of a *potential energy surface*: a function of the nuclear coordinates. Local minima are conformations the molecule can linger in. Barriers between minima are the rearrangements that require a kick of thermal energy. A protein fold, a rotamer, or a ligand pose is, in this language, a region of that surface.

A molecular mechanics *force field* is an explicit, approximate formula for that surface: harmonic terms for bonds and angles, torsional terms for rotation around bonds, and nonbonded terms for electrostatics and van der Waals, usually with a large number of fitted parameters. *Energy minimization* walks downhill to a nearby minimum. *Molecular dynamics* integrates Newton's equations (with a thermostat and, typically, an explicit or implicit solvent) so the system can sample more than one well.

These models are useful and incomplete. Polarizability, protonation-state changes, bond breaking, and the fine structure of water networks are common sources of error. A score that looks precise to two decimal places is still a score.

## Stability is a free-energy statement

The quantity that actually decides whether a state is favored is the Gibbs free energy, $G$, at constant temperature and pressure. A standard textbook relation is

$$
\Delta G = \Delta H - T\Delta S
$$

where $\Delta H$ is the enthalpy change, $T$ is the absolute temperature, and $\Delta S$ is the entropy change. A process is thermodynamically favored when $\Delta G$ is negative, but a negative $\Delta H$ is not enough if it is paid for by a larger $T\Delta S$ term, and a process can be favored because of entropy even when it is enthalpically uphill.

For a simple equilibrium $A \rightleftharpoons B$, the equilibrium constant is related to the standard free-energy change by

$$
K = e^{-\Delta G^{\circ} / RT}
$$

where $R$ is the gas constant. A few kilocalories per mole — a small number next to the total energy of a protein — already shift $K$ by a large factor. That is why modeling binding is hard: you are trying to get a small difference right, and both the bound and unbound states include solvent and conformational entropy you do not see in a single crystal structure.

Docking programs and many learning-based affinity models are attempting, directly or indirectly, to approximate that $\Delta G$ or to rank poses in a way that correlates with it. Structure prediction, molecular dynamics, and alchemical free-energy methods are other points on the same spectrum, at very different cost and with very different assumptions. None of them removes the chemistry. They are ways of estimating a surface whose shape is set by bonding, electrostatics, and solvent.

Two practical consequences follow, even before you pick a method. First, the environment is part of the system: pH, ion concentrations, and water are not decoration. Second, a single low-energy snapshot can be misleading if the state that dominates at equilibrium is an ensemble.

For a careful development of the thermodynamics, a standard physical-chemistry text such as Atkins and de Paula, *Physical Chemistry*, is the usual starting point. For the biomolecular side, Dill and Bromberg's *Molecular Driving Forces* is the book I would hand someone who wants the same ideas in a biological setting.
