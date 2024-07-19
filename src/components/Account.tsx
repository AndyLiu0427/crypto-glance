import { Button } from '@mui/material'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  console.log('address', address)
  console.log('ensName', ensName)
  console.log('ensAvatar', ensAvatar)

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <p className="break-words">{ensName ? `${ensName} (${address})` : address}</p>}
      <Button
        variant="contained"
        color="error"
        onClick={() => disconnect()}
        sx={{ mt: 2, width: '100%' }}
      >
        Disconnect
      </Button>
    </div>
  )
}
