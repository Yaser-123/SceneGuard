"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, Info, Loader2 } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function CostBrainstormingBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/chat/history')
        if (response.ok) {
          const data = await response.json()
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content
            })))
          } else {
            setMessages([{
              role: 'assistant',
              content: "Hi! I'm your production cost brainstorming assistant. I can help you think through cost trade-offs, suggest ways to reduce production expenses, and explore creative solutions. What would you like to discuss?"
            }])
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm your production cost brainstorming assistant. I can help you think through cost trade-offs, suggest ways to reduce production expenses, and explore creative solutions. What would you like to discuss?"
        }])
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadHistory()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/bot/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white tracking-wider">COST BRAINSTORMING</h1>
          </div>
          <p className="text-sm text-neutral-400">
            Explore ideas to optimize production costs and manage trade-offs
          </p>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Brainstorming Mode Only</p>
                <p className="text-blue-300/80">
                  Your conversation history is saved for continuity, but it doesn&apos;t affect scene analysis or cost calculations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3 border-b border-neutral-700">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CONVERSATION</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingHistory ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading conversation...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30'
                          : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-neutral-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-700 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about cost reduction strategies, trade-offs, or optimization ideas..."
                      className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                      disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-blue-500 hover:bg-blue-600 text-white">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Press Enter to send • Your conversation is automatically saved</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">EXAMPLE QUESTIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "How can I reduce costs for a night shoot?",
                "What are trade-offs between location and studio?",
                "How does crew size affect production budget?",
                "Tips for managing costs with large extras?",
                "When should I use VFX vs practical effects?",
                "How to optimize schedule to reduce costs?"
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="text-left text-sm text-neutral-400 hover:text-blue-400 hover:bg-neutral-800 p-2 rounded transition-colors"
                  disabled={isLoading}
                >
                  → {question}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
