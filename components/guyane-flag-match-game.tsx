"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type FlagCard = {
  id: number
  variant: string
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

const flagVariants = [
  {
    name: "Apple",
    imageUrl: "https://em-content.zobj.net/thumbs/240/apple/325/flag-french-guiana_1f1ec-1f1eb.png"
  },
  {
    name: "Google",
    imageUrl: "https://em-content.zobj.net/thumbs/240/google/350/flag-french-guiana_1f1ec-1f1eb.png"
  },
  {
    name: "Samsung",
    imageUrl: "https://em-content.zobj.net/thumbs/240/samsung/349/flag-french-guiana_1f1ec-1f1eb.png"
  },
  {
    name: "Twitter",
    imageUrl: "https://em-content.zobj.net/source/twitter/348/flag-french-guiana_1f1ec-1f1eb.png"
  },
  {
    name: "WhatsApp",
    imageUrl: "https://em-content.zobj.net/thumbs/240/whatsapp/326/flag-french-guiana_1f1ec-1f1eb.png"
  },
  {
    name: "Facebook",
    imageUrl: "https://em-content.zobj.net/thumbs/240/facebook/355/flag-french-guiana_1f1ec-1f1eb.png"
  },
  {
    name: "JoyPixels",
    imageUrl: "https://em-content.zobj.net/thumbs/240/joypixels/340/flag-french-guiana_1f1ec-1f1eb.png"
  },
  
  {
    name: "OpenMoji",
    imageUrl: " https://em-content.zobj.net/source/openmoji/384/flag-french-guiana_1f1ec-1f1eb.png"
  }
]

export function GuyaneFlagMatchGame() {
  const [cards, setCards] = useState<FlagCard[]>([])
  const [flippedCards, setFlippedCards] = useState<FlagCard[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && matchedPairs < flagVariants.length) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, matchedPairs])

  const shuffleCards = () => {
    const shuffledCards = [...flagVariants, ...flagVariants]
      .sort(() => Math.random() - 0.5)
      .map((variant, index) => ({
        id: index,
        variant: variant.name,
        imageUrl: variant.imageUrl,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffledCards)
    setMatchedPairs(0)
    setTimer(0)
    setGameStarted(false)
  }

  const handleCardClick = (clickedCard: FlagCard) => {
    if (!gameStarted) {
      setGameStarted(true)
    }

    if (flippedCards.length === 2 || clickedCard.isMatched) return

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )

    setCards(newCards)
    setFlippedCards([...flippedCards, clickedCard])

    if (flippedCards.length === 1) {
      if (flippedCards[0].variant === clickedCard.variant) {
        const matchedCards = newCards.map((card) =>
          card.variant === clickedCard.variant ? { ...card, isMatched: true } : card
        )
        setCards(matchedCards)
        setMatchedPairs((prev) => prev + 1)
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setCards(
            newCards.map((card) =>
              card.isMatched ? card : { ...card, isFlipped: false }
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-red-400
      text-3xl font-bold mb-4 text-secondary ">Guyane Flag Game</h1>
      <div className="text-slate-200 mb-4 text-xl text-green-400/75">
        Time: {formatTime(timer)}
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-24 h-24 flex items-center justify-center 
              cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? "bg-primary"
                : "bg-secondary"
            }`}
            onClick={() => handleCardClick(card)}
          >
            {card.isFlipped || card.isMatched ? (
              <img
                src={card.imageUrl}
                alt={`French Guiana flag - ${card.variant} design`}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <span className="text-4xl">?</span>
            )}
          </Card>
        ))}
      </div>
      <Button onClick={shuffleCards} className="mt-4">
        {gameStarted ? "Reset Game" : "Start Game"}
      </Button>
      {matchedPairs === flagVariants.length && (
        <div className="mt-4 text-xl font-bold text-success">
          Congratulations! You completed the game in {formatTime(timer)}!
        </div>
      )}
    </div>
  )
}