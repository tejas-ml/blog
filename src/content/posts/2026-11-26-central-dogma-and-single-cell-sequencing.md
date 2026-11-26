---
title: "From the central dogma to single-cell sequencing"
description: "A short explainer of how information flows from DNA to RNA to protein, why bulk measurements average away cell differences, and what a single-cell experiment actually produces."
pubDate: 2026-11-26
category: biology
tags: ["biology", "single-cell", "genomics", "computational biology"]
---

Most of computational biology is an attempt to measure, and then model, how cells use information. The oldest useful sketch of that information flow is still the right place to start.

## The central dogma

Francis Crick stated the *central dogma* of molecular biology in 1958, and returned to it in a 1970 note in *Nature*. In the form most people meet first, DNA is transcribed into RNA, and RNA is translated into protein. The important restriction is not the cartoon of arrows. It is the claim that sequence information does not flow backward from protein into nucleic acids.

That picture is still the backbone of the field, and a few well-known amendments belong in the same paragraph, not as contradictions. Reverse transcriptase, found in retroviruses, can copy RNA into DNA, so the DNA-to-RNA step is not one-way in every organism. RNA can also be an end product rather than a messenger: ribosomal RNA, transfer RNA, and a long list of regulatory RNAs never become protein. Proteins can modify other proteins, and they can regulate transcription, but they do not generally rewrite a gene's nucleotide sequence from their amino acids.

A gene is a stretch of DNA that can be transcribed. In a given cell, at a given time, some genes are on and others are not. Transcription factors, chromatin state, and the availability of the transcription machinery all influence that choice. After transcription, splicing, RNA stability, translation rate, and protein degradation still stand between a gene and the amount of protein you would actually measure. "Expression" is therefore not one number with one cause.

## Why a tissue average is not a cell

For years, the workhorse measurement has been *bulk* RNA sequencing: collect many cells, extract RNA, and count how often fragments of each transcript appear. The result is an average over the mixture you put in the tube.

Averages are useful. They are also easy to misread. A tumor sample can contain malignant cells, immune cells, and stroma. A developing tissue can contain cells at different stages of the same trajectory. In both cases, a gene that is high in one subpopulation and off in another can look like a moderate signal, or disappear into noise. If the question is "which cell types are here, and what is each of them doing?", a bulk average is the wrong object.

## What single-cell sequencing measures

Single-cell RNA sequencing (scRNA-seq) tries to attach a transcriptome — or at least a sample of it — to an individual cell, or sometimes to a nucleus. The details vary by protocol, but the logic is shared:

1. Separate cells (or nuclei), often in droplets or wells.
2. Capture messenger RNA, typically by its poly-A tail.
3. Attach a cell barcode so that later reads can be grouped back to their cell of origin, and often a unique molecular identifier (UMI) so that PCR duplicates of the same molecule can be collapsed.
4. Convert RNA to complementary DNA, amplify, and sequence.
5. Align or map the reads to a reference and build a gene-by-cell count matrix.

That matrix is the starting point for almost every computational analysis. It is large, sparse, and noisy. Many entries are zero, not always because the gene is off, but because a modest number of molecules were sampled from a cell that contains many more. This *dropout* is a measurement problem, not automatically a biological one.

A typical analysis then does some version of the following: quality control (for example, filtering cells with too few counts or a very high mitochondrial fraction), normalization, selection of informative genes, dimensionality reduction, clustering, and assignment of cell-type labels from known marker genes or from a reference atlas. Downstream, people ask about differential expression, cell–cell communication, or trajectories through a process such as differentiation. Each of those steps has more than one reasonable method, and the choice changes the picture you get.

## More than one modality

RNA is not the only thing a cell can report. Single-cell ATAC-seq measures chromatin accessibility — which regions of the genome are open enough for a transposase to insert — and is often used as a proxy for regulatory potential. Other assays measure surface proteins together with RNA, or DNA methylation, or combinations of these in the same cell. Those *multi-omic* experiments exist because the central dogma is a flow, not a single snapshot: accessibility, transcripts, and proteins can disagree, and the disagreement is sometimes the interesting part.

Integrating those views, especially across cohorts and laboratories, is one of the computational problems my field works on. I will write about methods there as I have something concrete to show. This post is only the background: information flows from genome to transcriptome to proteome, cells in a sample are not interchangeable, and a single-cell experiment gives you a noisy matrix that has to be interpreted with that biology in mind.

If you want a canonical statement of the dogma itself, Crick's 1970 *Nature* note, "Central dogma of molecular biology," is short and still worth reading. For the cell-biological setting around it, Alberts et al., *Molecular Biology of the Cell*, is the standard textbook.
