import { ChatGPTAPI } from 'chatgpt'

const api_key = "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"

async function example() {
  const api = new ChatGPTAPI({
    apiKey: api_key,
  })

  const res = await api.sendMessage('beri satu kata-kata bijak atau motivasi atau galau')
  console.log(res.text)
}
