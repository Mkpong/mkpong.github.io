---
title: "About"
description: "Jaeyoung — M.S. student at BoanLab, Dankook University, working on AI infrastructure."
showToc: false
hidemeta: true
comments: false
ShowBreadCrumbs: false
---

Hi, I'm **Jaeyoung**, an M.S. student in the Department of AI Convergence at Dankook University (BoanLab), working on AI infrastructure. This blog is where I write down what I learn — and what breaks — along the way. Posts are written in Korean.

I think training and serving large models ultimately comes down to **how efficiently you can drive a handful of GPUs**. That's why I'm more interested in what sits below the framework — schedulers, networking, memory, and kernels — than in the framework itself.

## Interests

- **Distributed training** — data/tensor/pipeline parallelism, NCCL, communication–computation overlap
- **Model serving** — vLLM, Triton, KV-cache management, batching strategies
- **GPU scheduling** — GPU resource management on Kubernetes, MIG/MPS, queueing
- **Performance analysis** — profiling, bottleneck hunting, benchmark design
- **MLOps** — experiment tracking, reproducible training pipelines

## Experience

{{< timeline >}}
{{< tl-item date="Mar 2025 – Present" title="M.S. Student, Dept. of AI Convergence, Dankook University" sub="BoanLab" >}}
Research on AI infrastructure and systems
{{< /tl-item >}}
{{< tl-item date="Aug 2024 – Feb 2025" title="Undergraduate Researcher" sub="BoanLab" >}}
Introductory research on distributed training and GPUs
{{< /tl-item >}}
{{< tl-item date="Jul 2023 – Jul 2024" title="Undergraduate Researcher" sub="CIS Lab" >}}
Computer vision solution for the visually impaired, ML model training, embedded board programming on Arduino
{{< /tl-item >}}
{{< tl-item date="Mar 2019 – Feb 2025" title="B.S. in Computer Science and Engineering, Dankook University" >}}
{{< /tl-item >}}
{{< /timeline >}}

## Publications

{{< pubs >}}
{{< pub title="gSonar: Quantifying and Attributing GPU Interference under Time-Slicing and MPS" venue="IEEE Access, 2026" status="Under review" >}}
{{< pub title="Time-Slicing GPU 공유 환경에서 eBPF 기반 파드 단위 관측 및 간섭 분석" venue="KCC 2026" award="Best Presentation Award" >}}
{{< pub title="Sentra: A Kubernetes Sidecar-Based Multi-Layer Security Gateway for Protecting LLM APIs" venue="MobiSec 2025" type="Poster" award="KIISC Best Poster Award" >}}
{{< pub title="KubeScribe: LLM-Driven Automation of Runtime Security Policies in Cloud-Native Environments" venue="ICTC 2025" >}}
{{< pub title="쿠버네티스 기반 서비스 메시 환경에서의 mTLS 적용에 따른 네트워크 성능 분석" venue="ASK 2025" note="2nd author" >}}
{{< pub title="대규모 NLP 모델에서 병렬화 기법의 성능 분석" venue="ACK 2024" >}}
{{< /pubs >}}

## Tech Stack

| Area | Tools |
|---|---|
| Languages | Python, C++, Go, Bash |
| ML | PyTorch, CUDA, NCCL, Triton |
| Infrastructure | Kubernetes, Docker, Slurm, Terraform |
| Observability | Prometheus, Grafana, Nsight Systems |

## About this blog

- Built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, deployed to GitHub Pages via GitHub Actions.
- Found a mistake or know a better way? Use the **Suggest an edit** link at the top of each post, or open a GitHub issue.
- Source: [github.com/mkpong/mkpong.github.io](https://github.com/mkpong/mkpong.github.io)

## Contact

- GitHub: [@mkpong](https://github.com/mkpong)
- Email: [leeja042499@gmail.com](mailto:leeja042499@gmail.com)
