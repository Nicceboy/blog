---
title: "OCI containers, Arch Linux ARM and LaTeX on Apple Silicon "
date: 2023-02-11
draft: true
tags: ["containers", "docker", "mac", "arm", "latex", "oci"]
author: Niklas Saari
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: true
draft: false
hidemeta: false
comments: false
description: "Building and using ARM-based OCI images on Apple Silicon from scratch"
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: false 
ShowReadingTime: true
ShowBreadCrumbs: false
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
params:
    ShowBreadCrumbs: true
cover:
    image: "latex.svg"
    # alt: "Testing MTGArena on container."
    # caption: "Magic The Gathering: Arena works well when played from the Linux container." -->
    relative: true # when using page bundles set this to true
    hidden: false # only hide on current single page
editPost:
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

Since the release of Apple's M1 Chips, ARM architecture has expanded to a larger user base.
The power efficiency and performance of the new chips have made them quite desirable.
Unfortunately, most of the existing developer-required toolchains were for x86_64 architecture in many cases.

This blog post introduces a brief overview of how to set up a container runner on your ARM Macbook and how to create an AArch64 [Open Container Initiative (OCI)](https://opencontainers.org/about/overview/) container image from the scratch.
The example builds TexLive for LaTeX since I could not find an existing up-to-date image after I sold my soul to the devil by getting M2 Chip.

There **might** be simpler ways to build LaTeX documents on your Macbook, but this gives us the most control in a reproducible environment!

## Setting up container runner

There are already quite many options to run OCI containers even on ARM.
The obvious choice would be [*Docker Desktop on Mac*](https://docs.docker.com/desktop/install/mac-install/), but we don't want yet-another Chromium instance to consume battery.  

There are options, but they are all QEMU based since containers are based on Linux: 
  * [Colima](https://github.com/abiosoft/colima) as a minimal CLI-based daemon (containerd/dockerd) with [Lima](https://github.com/lima-vm/lima)
  * [Finch](https://github.com/runfinch/finch) as [AWS](https://aws.amazon.com/blogs/opensource/introducing-finch-an-open-source-client-for-container-development/) backed, aims to bring native client on MacOS for nerdctl and containerd
  * [Podman](https://podman.io/getting-started/installation) (No daemon,based on libpod)
  * [Podman Desktop](https://podman-desktop.io/) (No daemon, based on libpod)
  * [Rancher](https://rancherdesktop.io/) (containerd/dockerd and Lima)