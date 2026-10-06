# Hindsight server setup guide (the owner's own)

This is the owner's own guide for building the shared Hindsight server (received 2026-10-05; written 2026-10-01 and 2026-10-02).

This file is a record and is not edited. Any change goes in the owner's original, or in a new record.

---

This is the living setup guide for a shared Hostinger VPS that can serve memory for multiple projects. Anchor is the first project being connected across devices. The VPS runs Hindsight, PostgreSQL, and Ollama. Ollama runs the memory-processing model on the VPS, so there is no per-token model API bill. The VPS itself remains a paid service. This is a **pilot configuration**: check speed and memory use before relying on it for daily work.

## How to follow this guide

You will use three places. **Hostinger in your browser** is where you buy and configure the server and domain. **Web Console in Hostinger** is where you paste server commands. **Terminal on your Mac** is where you connect your coding agent later.

Follow the steps in order. Paste commands one line at a time and press Enter. Wait for the prompt to return before the next command. Copy only the text inside a code box, without the surrounding Markdown marks. A command can succeed without printing anything.

Every occurrence of `example.com` is a placeholder. Replace it with your actual domain. Keep your chosen domain, VPS IPv4 address, and passwords in your password manager. The two web addresses will be created below; you do not need to build a website.

**Costs:** the VPS and domain registration cost money, including renewals. Ollama avoids a paid model API. This guide has not yet been tested on your running VPS.

## What you are setting up

The Anchor Git repository remains the home for code, rules, skills, and project documents. Hindsight keeps changing memory from agent sessions in a separate bank for each project. Each supported coding-agent installation connects to the same VPS and uses the appropriate project bank. Anchor is the first project to connect.

| Address | Purpose |
| - | - |
| `https://memory.example.com` | Hindsight dashboard for you |
| `https://memory-api.example.com` | Hindsight API for coding agents |

Replace `example.com` with a domain you own. **Assumption:** this is a fresh VPS with no other application using ports 80 or 443.

## Before you buy a VPS

- [x] Purchase and set up **Hostinger KVM 2 (2 vCPU, 8 GB RAM)** with **Ubuntu 24.04 with Docker**. Hostinger showed Payment successful on October 1, 2026, and the new VPS Overview now shows Running. The original KVM 4 (4 vCPU, 16 GB RAM) recommendation offered more room for the all-local Hindsight and Ollama stack. Treat KVM 2 as a capacity test and check memory use and processing speed before daily use. [Hostinger plans](https://www.hostinger.com/vps-hosting) · [Docker template](https://www.hostinger.com/support/8306612-how-to-use-the-docker-vps-template-at-hostinger/) · [Hindsight resource guidance](https://hindsight.vectorize.io/developer/installation)

- [x] Have a domain whose DNS records you can edit — `mrihm-memory.com` is Active in Hostinger, and its DNS / Nameservers page has the Manage DNS records editor.

- [x] Generate and save three different values in a password manager: a PostgreSQL password, a Hindsight API token, and a dashboard access key. There is **no OpenAI API key** in this setup.

**Why this is a pilot:** We will start with Ollama's `qwen3:4b`, a 2.5 GB model listed as supporting tools. Hindsight has not specifically verified it for this configuration, and its own guidance warns that small CPU-hosted models can process memories slowly and with lower quality. Hindsight reports that even its small local-model example can produce only about 2–3 tokens per second on CPU. If this pilot is too slow, a more powerful server or a GPU-hosted model may be needed. [Ollama model listing](https://ollama.com/library/qwen3:4b) · [Hindsight local-model example](https://github.com/vectorize-io/hindsight/blob/main/docker/docker-compose/local-llm/README.md) · [Hindsight performance guidance](https://hindsight.vectorize.io/developer/performance)

## Set up the Hostinger VPS

### Progress recorded October 1, 2026

- [x] Selected `mrihm-memory.com` and chose the domain-only purchase.

- [x] Completed payment; Hostinger showed **Order received**.

- [x] Declined the optional Hostinger Agent subscription.

- [x] Finish domain registration and verify the registration email (confirmed by Michael).

- [x] Confirm the domain appears as active in Hostinger hPanel.

- [x] Add DNS A records for `memory` and `memory-api`, both pointing to `179.236.232.219`.

- [x] Activate the prepared `Shared VPS` firewall on the new VPS. Hostinger shows it as Active with rules for TCP ports 22, 80, and 443; applying the rules may take up to 5 minutes.

- [x] Open the VPS console, create `/opt/hindsight`, enter that folder, and run `umask 077` so new files are private.

- [x] Save `/opt/hindsight/.env` with both memory domain names and three saved secret values. The unsaved Nano draft was recovered from `.env.save` after the console tab closed; the restored `.env` exists with private `600` permissions. Secret values were not copied into this guide.

- [x] Save `/opt/hindsight/compose.yaml` and `Caddyfile` for Hindsight, PostgreSQL, local Ollama, and HTTPS routing. `docker compose config --quiet` completed without errors; Caddy is now running.

- [x] Start PostgreSQL, Ollama, and Hindsight internally on the shared VPS. PostgreSQL reports healthy; Ollama and Hindsight are running without published ports. Download `qwen3:4b` into Ollama and confirm it appears in `ollama list` (2.5 GB).

- [x] Confirm Hostinger automatic VPS backups are scheduled weekly. The Backups page currently shows no backup created yet; the optional daily upgrade is not needed for this pilot.

Hostinger hPanel shows `mrihm-memory.com` as Active with ownership contact details. Michael confirmed the registration email is verified. The general domain checklist offers optional website, email, and Domain Shield services; they are not needed for this guide. A stale to-do offered to set up another domain, which should be ignored. Hostinger's original VPS list showed one expired KVM 2 and a separate running KVM 2 (Hermes-Baldwin.cloud). A new KVM 2 was purchased and set up on October 1, 2026 as the shared memory VPS; Anchor is its first project. Its Overview shows Running, United States – Boston 2, Ubuntu 24.04 with Docker, and IPv4 `179.236.232.219`. Hostinger DNS now has A records for `memory` and `memory-api` pointing to `179.236.232.219`, both with the default TTL of 14400. The existing `@` and `www` records were left unchanged. Leave the older KVM 2 servers alone.

### 1. Get a domain

If you already own a domain and can change its DNS settings, use it and skip the purchase. You can add these two addresses alongside an existing website. You do not buy `memory` and `memory-api` separately.

If you do not own a domain:

1. Open [Hostinger domain search](https://www.hostinger.com/domain-name-search) in your browser and sign in.

2. Search for a name you like. Choose an available domain and add it to your cart.

3. Review both the first payment and renewal price. Purchase the domain; you do not need a website or email hosting plan for this guide.

4. Return to Hostinger hPanel. If the domain says **Pending setup**, choose **Setup**, enter the requested owner/contact information, and finish registration.

5. Open the verification email sent to your registration email address and complete verification.

6. Write down the exact domain, such as `myanchormemory.com`. Use your own purchased name everywhere this guide says `example.com`.

[Hostinger domain purchase instructions](https://www.hostinger.com/support/1583421-how-to-purchase-a-domain-name-at-hostinger/) · [Domain activation and verification](https://www.hostinger.com/support/1583403-how-long-does-it-take-for-a-new-domain-to-be-active-at-hostinger/)

### 2. Finish setting up your VPS

The shared memory VPS was renamed to `shared-memory-vps.mrihm-memory.com` on October 2, 2026 (original Hostinger hostname: `srv2026626.hstgr.cloud`), a running KVM 2 with Ubuntu 24.04 with Docker. Its IPv4 address is `179.236.232.219`. Use this address for the DNS records below. The older KVM 2 servers are unrelated.

1. If it needs setup, click **Setup**. Choose a location near you, then **Ubuntu 24.04 with Docker** as the operating system/template.

2. Set the root password when asked and save it in your password manager. This password is for administering the VPS.

3. Complete setup and wait until the server is running.

4. Click **Manage** for that VPS, then **Overview**. Find **SSH information** and copy the **IPv4 address**. It looks like four numbers separated by dots.

5. Keep this browser tab open. You will return to it throughout the guide.

If the server is already running, check its operating system before proceeding. Changing or reinstalling the operating system erases the server, so do not reinstall an existing server that contains work.

[Hostinger VPS setup](https://www.hostinger.com/support/1583582-how-and-why-to-purchase-vps-hosting-at-hostinger/) · [Docker template](https://www.hostinger.com/support/8306612-how-to-use-the-docker-vps-template-at-hostinger/) · [VPS dashboard](https://www.hostinger.com/support/5726606-how-to-use-the-vps-dashboard-in-hostinger/)

### 3. Point your domain at the VPS

DNS is the address book that directs your domain to your server.

1. In Hostinger hPanel, open **Domains → Domain portfolio**.

2. Click **Manage** beside your domain, then **DNS / Nameservers**.

3. In **DNS records**, add the two records below. Use the IPv4 address you copied from the VPS. Click **Add Record** for each.

| Field | First record | Second record |
| - | - | - |
| Type | A | A |
| Name or Host | memory | memory-api |
| Points to or Value | Your VPS IPv4 address | The same VPS IPv4 address |
| TTL | Leave the default | Leave the default |

Enter just `memory` or `memory-api` in Name. Do not enter `https://` there. If records already exist for those exact names, edit the conflicting records. Keep records for your existing website and email.

If your domain uses another company's nameservers, add these records in that company's DNS dashboard instead. You do not need to transfer the domain. For Cloudflare, choose **DNS only** initially.

Allow up to 24 hours for DNS changes. The addresses may not show a working page yet because Hindsight has not started.

[Hostinger DNS editor](https://www.hostinger.com/support/how-to-use-hostingers-dns-zone-editor/) · [Pointing a domain to a VPS](https://www.hostinger.com/support/1583227-how-to-point-a-domain-to-your-vps-at-hostinger/)

### 4. Set the firewall

A firewall controls which connections can reach the server.

1. Open **VPS → Manage → Security → Firewall** in hPanel.

2. Click **Add Firewall**, give it a name such as `Shared VPS`, and create it.

3. Open its menu and choose **Edit**.

4. Add each rule below. Choose **Accept**, **TCP**, and **Anywhere** for the source, then click **Add rule**.

5. After all three rules exist, activate this firewall for your VPS.

| Action | Protocol | Port | Source |
| - | - | - | - |
| Accept | TCP | 22 | Anywhere |
| Accept | TCP | 80 | Anywhere |
| Accept | TCP | 443 | Anywhere |

Port 22 is for administration; 80 and 443 let Caddy set up and serve HTTPS. Do not add public rules for 5432, 8888, 9999, or 11434.

[Hostinger firewall instructions](https://www.hostinger.com/support/8172641-how-to-use-a-managed-vps-firewall-at-hostinger/) · [Caddy HTTPS requirements](https://caddyserver.com/docs/quick-starts/https)

### 5. Open the Hostinger VPS console

1. In hPanel, open **VPS → Manage → Overview**.

2. Click **Web Console**. Allow popups from hPanel if your browser blocks the new tab.

3. If a login is requested, enter `root`, press Enter, then enter the VPS root password and press Enter. Password characters may remain invisible; that is normal.

4. You should see a text prompt waiting for a command. All commands until the device-connection section go in this console.

[Hostinger Web Console instructions](https://www.hostinger.com/support/how-to-use-the-web-console-in-hostinger/)

Run the next three lines one at a time. They create and enter the server's Hindsight folder and make new files private.

```bash
mkdir -p /opt/hindsight
cd /opt/hindsight
umask 077
```

In the VPS console, type `openssl rand -hex 32` and press Enter. It prints one long random string. Copy that string into your password manager as **database password**.

Run the same command again and save the new result as **Hindsight API token**. Run it a third time and save that result as **dashboard access key**. These are three different secrets you generate yourself; none comes from OpenAI.

Keep the values out of chat and Git. You will paste them into the next file.

### 6. Create the private settings file

1. In the VPS console, type `nano .env` and press Enter. Nano is a simple text editor.

2. Paste the five lines below into it.

3. Replace `example.com` in both addresses with your domain. These lines contain domain names without `https://`.

4. Replace the three `PASTE_...` values with the corresponding secrets from your password manager. Keep the name and equals sign on each line. Do not add spaces around the equals sign.

5. Hold **Control** and press **O** to save. Press **Enter** to confirm the filename. Hold **Control** and press **X** to close the editor. On a Mac, use Control here, not Command.

You should now be back at the console prompt.

```dotenv
API_DOMAIN=memory-api.example.com
UI_DOMAIN=memory.example.com
POSTGRES_PASSWORD=PASTE_DATABASE_PASSWORD
HINDSIGHT_API_TOKEN=PASTE_HINDSIGHT_API_TOKEN
HINDSIGHT_UI_KEY=PASTE_DASHBOARD_ACCESS_KEY
```

Run `chmod 600 .env`. Use the 64-character hexadecimal strings produced by `openssl`; that also keeps the PostgreSQL connection URL simple.

### 7. Create the Docker configuration

In the VPS console, type `nano compose.yaml` and press Enter. Paste the entire box below, keeping its spaces and indentation. No placeholders in this box need replacing; it reads your settings from the previous file.

Save with **Control+O**, **Enter**, then exit with **Control+X**.

```yaml
services:
  db:
    image: pgvector/pgvector:pg18
    restart: unless-stopped
    environment:
      POSTGRES_USER: hindsight_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: hindsight_db
    volumes:
      - pg_data:/var/lib/postgresql/18/docker
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hindsight_user -d hindsight_db"]
      interval: 10s
      timeout: 5s
      retries: 10

  ollama:
    image: ollama/ollama:latest
    restart: unless-stopped
    environment:
      OLLAMA_NUM_PARALLEL: "1"
      OLLAMA_MAX_LOADED_MODELS: "1"
      OLLAMA_CONTEXT_LENGTH: "8192"
    volumes:
      - ollama_data:/root/.ollama

  hindsight:
    image: ghcr.io/vectorize-io/hindsight:latest
    restart: unless-stopped
    shm_size: 1gb
    environment:
      HINDSIGHT_API_DATABASE_URL: postgresql://hindsight_user:${POSTGRES_PASSWORD}@db:5432/hindsight_db
      HINDSIGHT_API_LLM_PROVIDER: ollama
      HINDSIGHT_API_LLM_MODEL: qwen3:4b
      HINDSIGHT_API_LLM_BASE_URL: http://ollama:11434/v1
      HINDSIGHT_API_LLM_OLLAMA_NUM_CTX: "8192"
      HINDSIGHT_API_LLM_MAX_CONCURRENT: "1"
      HINDSIGHT_API_LLM_TIMEOUT: "300"
      HINDSIGHT_API_LLM_MAX_RETRIES: "2"
      HINDSIGHT_API_ENABLE_OBSERVATIONS: "false"
      HINDSIGHT_API_WORKER_ID: hindsight-main
      HINDSIGHT_API_TENANT_EXTENSION: hindsight_api.extensions.builtin.tenant:ApiKeyTenantExtension
      HINDSIGHT_API_TENANT_API_KEY: ${HINDSIGHT_API_TOKEN}
      HINDSIGHT_CP_DATAPLANE_API_URL: http://localhost:8888
      HINDSIGHT_CP_DATAPLANE_API_KEY: ${HINDSIGHT_API_TOKEN}
      HINDSIGHT_CP_ACCESS_KEY: ${HINDSIGHT_UI_KEY}
    depends_on:
      db:
        condition: service_healthy
      ollama:
        condition: service_started

  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      API_DOMAIN: ${API_DOMAIN}
      UI_DOMAIN: ${UI_DOMAIN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  pg_data:
  ollama_data:
  caddy_data:
  caddy_config:
```

The Ollama service has **no public port**. Hindsight reaches it through Docker's private network. PostgreSQL and Hindsight's internal ports are also not published. Hindsight supports Ollama as a local LLM provider; its full image supplies local embedding and reranking models. [Hindsight configuration](https://hindsight.vectorize.io/developer/configuration) · [Hindsight models](https://hindsight.vectorize.io/developer/models) · [Ollama Docker image](https://ollama.com/blog/ollama-is-now-available-as-an-official-docker-image)

### 8. Create the HTTPS routing file

In the VPS console, type `nano Caddyfile` and press Enter. The capital C matters. Paste the box below exactly as written; it also reads the domain names from your settings.

Save with **Control+O**, **Enter**, then exit with **Control+X**. Caddy will request and renew the HTTPS certificates automatically once DNS and the firewall are ready.

```caddyfile
{$API_DOMAIN} {
    reverse_proxy hindsight:8888
}

{$UI_DOMAIN} {
    reverse_proxy hindsight:9999
}
```

### 9. Start Ollama and download the model

You should still be in the VPS console. Run `cd /opt/hindsight` first if you reopened the console.

Run the next commands one at a time. The first checks the configuration and normally prints nothing when it succeeds. If it prints an error, stop and correct that error before continuing. The download command shows progress; wait for it to finish.

```bash
docker compose config --quiet
docker compose up -d db ollama caddy
docker compose exec ollama ollama pull qwen3:4b
docker compose exec ollama ollama list
```

The list should show `qwen3:4b`. Then start Hindsight:

```bash
docker compose up -d hindsight
docker compose ps
```

The model download and first startup may take several minutes. In the `docker compose ps` output, look for the four services to be running; the database should also be healthy.

Open a new browser tab and enter your actual dashboard address, such as `https://memory.your-domain.com`. Enter the **dashboard access key** you generated earlier when requested.

If it does not open, allow for DNS propagation, then run these commands separately in the VPS console:

```bash
docker compose logs --tail=50 caddy
docker compose logs --tail=50 hindsight
```

Save the error text and ask for help with that specific step. Remove any passwords or tokens before sharing it. A running container alone does not prove memory processing works; complete the acceptance check below.

### 10. Enable backups

In **Hostinger VPS → Manage → Backups & Monitoring → Snapshots & Backups**, confirm automatic VPS backups are on. Weekly backups are Hostinger's default; daily backups are an optional paid upgrade. The memory database and downloaded model are in Docker volumes. [Hostinger backup instructions](https://support.hostinger.com/en/articles/1583232-how-to-back-up-or-restore-a-vps)

## Connect Anchor from each device

### 1. Prepare your Mac

Do these steps on your Mac, not in the VPS console. The Anchor repository should already be downloaded to this computer.

1. Open [Node.js downloads](https://nodejs.org/en/download). Choose **LTS**, **macOS**, and the **Installer (.pkg)** appropriate for your Mac. Download it, open it, and follow the installer.

2. Press **Command+Space**, type `Terminal`, and press Enter.

3. Type `npx --version` and press Enter. A version number means it is available. If you see “command not found,” close and reopen Terminal after installing Node.

4. Open Finder and find the Anchor project folder.

5. In Terminal, type `cd ` including the trailing space. Drag the Anchor folder from Finder into Terminal, then press Enter.

6. Type `pwd` and press Enter. Copy the resulting folder path for the settings below.

7. Type `git rev-parse --show-toplevel` and press Enter. It should print the repository path. If it says this is not a Git repository, locate the actual Anchor repository before continuing.

### 2. Install the integration

Install the [Hindsight coding-agent integration](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md) on each computer. Use the command for the agent you have installed. Replace `example.com` with your domain first. If npx asks permission to download the package, type `y` and press Enter.

**For Claude Code:**

```bash
npx @vectorize-io/hindsight-coding-agents install claude-code --server self-hosted --api-url https://memory-api.example.com
```

**For Codex CLI:**

```bash
npx @vectorize-io/hindsight-coding-agents install codex --server self-hosted --api-url https://memory-api.example.com
```

These documented installers target Claude Code and **Codex CLI**. Support for a particular desktop app or hosted agent session must be checked separately. If a cloud environment is temporary, install the integration when that environment starts and pass its API token through the cloud provider's secret settings.

### 3. Connect only the Anchor project

In your Mac Terminal, run `mkdir -p ~/.hindsight`, then `nano ~/.hindsight/coding-agent.json`.

If the installer already created this file, edit its existing settings rather than adding a second JSON object. Preserve other settings you need. The example below shows the required settings for this guide.

Replace the API address with your real address, the token with your **Hindsight API token** from your password manager, and the folder path with the exact `pwd` result from step 1. The dashboard access key is a different secret and does not belong here.

Keep the quotes, commas, and braces. Save with **Control+O**, **Enter**, then **Control+X**.

```json
{
  "serverMode": "self-hosted",
  "apiUrl": "https://memory-api.example.com",
  "apiToken": "PASTE_HINDSIGHT_API_TOKEN",
  "optInOnly": true,
  "optInPaths": ["/actual/path/to/Anchor"]
}
```

In Mac Terminal, run `chmod 600 ~/.hindsight/coding-agent.json`. Restart the coding agent so it loads the new integration.

Repeat this section on the other computer, using the same API address and token but that computer's Anchor folder path. Use the **same repository folder name, including capitalization**, on both devices: the default bank name uses that name, for example `coding-agent::Anchor`. Check the bank reported by the integration before storing real memories. [Integration opt-in and bank rules](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md)

The private connection settings stay on each computer. Your Git repository carries the shared code and instructions. Do not commit the token file.

### 4. Connect a cloud session

Cloud environments differ, so the exact clicks depend on the provider. Install the integration there too, configure the same API address and token through its private secret settings, and opt in the cloud's actual repository path. Check that it selects the same bank. Tell me which cloud coding service you use before following provider-specific steps.

## Test the connection step by step

1. Start your supported coding agent inside the Anchor repository.

2. Ask it: “Run hindsight_diagnose or hindsight_sync_status. Tell me whether the server connection works and which memory bank this project uses.” Confirm the reported bank is the expected Anchor bank.

3. Give it one true, non-secret project fact and ask it to retain that fact in Hindsight. Wait for processing to finish; the CPU model may be slow.

4. Open the dashboard and check that the fact appears in that bank.

5. Start a fresh agent session on the other computer, inside its Anchor repository. Ask it to recall that fact from Hindsight. Confirm it reads the same bank.

6. In Hostinger's VPS dashboard, check CPU and RAM usage while a memory is processing.

If the agent cannot find those Hindsight tools, stop here and check the integration installation and whether that particular agent supports it. This document covers the documented CLI integrations; a desktop app may need a different connection method.

## Acceptance check before daily use

- [x] The dashboard opens over HTTPS at `https://memory.mrihm-memory.com` and asks for the dashboard access key. Michael signed in successfully; the dashboard shows its welcome screen and offers to create the first memory bank.

- [x] `docker compose ps` shows the four services running: `db` is healthy; `ollama`, `hindsight`, and `caddy` are up. Caddy exposes ports 80 and 443; the other services have no public ports.

- [ ] The agent's `hindsight_diagnose` or `hindsight_sync_status` tool reports a successful connection and the expected Anchor bank.

- [ ] Store one **real, non-secret Anchor project fact** in a session, then confirm a fresh session on another device can recall it.

- [ ] Check VPS RAM/CPU usage and how long retention takes. If Hindsight repeatedly times out, is too slow for ordinary sessions, or extracts facts inaccurately, stop at this pilot and revisit the model or server size.

## After setup: reusable project memory onboarding

- [ ] Build a reusable operating package, likely a skill with any needed hooks, instructions, and agent rules. When Michael asks to use Hindsight for a new project, an agent should know how to create or select that project's separate memory bank, connect the project on each device, keep credentials private, and verify that saving and recall use the intended bank. Include a skill that opens the Hindsight dashboard directly to a named project's bank, using the correct bank link once its URL is verified. Complete this package after the shared server and Anchor pilot pass their checks.

## Continuing maintenance

Keep the VPS backed up. When updating the containers, first confirm a recent backup, then in `/opt/hindsight` run `docker compose pull` followed by `docker compose up -d`. Never run `docker compose down -v`: `-v` deletes the named volumes holding the database and model. The Anchor Git repo should continue to carry project rules and canonical documents; Hindsight is the changing session-memory layer.
