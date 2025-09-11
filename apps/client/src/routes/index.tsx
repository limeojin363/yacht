import { createFileRoute } from '@tanstack/react-router'
import GameRootComponent from '../pages/games/DefaultGame_SingleDevice/components/GameRoot'

export const Route = createFileRoute('/')({
  component: () => <GameRootComponent totalPlayers={3} />,
})
