import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

export default function ChatPage () {
	const [messageText, setMessageText] = React.useState('')
	const [messages, setMessages] = React.useState([])
	const router = useRouter()

	function handleNewMessage (text) {
		const message = {
			id: messages.length + 1,
			username: router.query.username,
			text: text,
			usernameUrl: router.query.usernameUrl,
		}
		setMessages([message, ...messages])
		setMessageText('')
	}
	// ./Sua lógica vai aqui
	return (
		<Box
			styleSheet={{
				display: 'flex',
				alignItems: { xs: 'center', sm: 'end', md: 'end', lg: 'center' },
				paddingBottom: { xs: '0', sm: '20vw', md: '18vw', lg: '0' },
				justifyContent: 'center',
				backgroundBlendMode: 'multiply',
				backgroundColor: appConfig.theme.colors.primary[300],
				backgroundImage: 'url(/background.gif)',
				backgroundRepeat: 'no-repeat',
				backgroundSize: {
					xs: '100%',
					sm: '120%',
					md: '105%',
					lg: '100% 110%',
				},
				'background-position': {
					sm: '60% top',
					md: '60% top',
					lg: '60% 50%',
				},
			}}>
			<Box
				styleSheet={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
					borderRadius: '5px',
					backgroundColor: appConfig.theme.colors.neutrals[700] + 'f1',
					height: '100%',
					maxWidth: '70%',
					maxHeight: '80vh',
					padding: '32px',
				}}>
				<Header />
				<Box
					styleSheet={{
						position: 'relative',
						display: 'flex',
						flex: 1,
						height: '80%',
						backgroundColor: appConfig.theme.colors.neutrals[600] + '99',
						flexDirection: 'column',
						dorderRadius: '5px',
						padding: '16px',
					}}>
					<MessageList
						messageList={messages}
						setMessageList={setMessages}
					/>
					<Box
						as='form'
						styleSheet={{
							display: 'flex',
							alignItems: 'center',
						}}>
						<TextField
							value={messageText}
							onChange={event => {
								setMessageText(event.target.value)
							}}
							onKeyPress={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleNewMessage(messageText)
								}
							}}
							placeholder='Insira sua messagem aqui...'
							type='textarea'
							styleSheet={{
								width: '100%',
								border: '0',
								resize: 'none',
								borderRadius: '5px',
								padding: '6px 8px',
								backgroundColor: appConfig.theme.colors.neutrals[800],
								marginRight: '12px',
								color: appConfig.theme.colors.neutrals[200],
							}}
						/>
						<FontAwesomeIcon
							onClick={e => {
								if (messageText.length > 0) {
									e.preventDefault()
									handleNewMessage(messageText)
								}
							}}
							style={{
								marginLeft: '10px',
								cursor: 'pointer',
								color: 'white',
								fontSize: '20px',
							}}
							icon={faPaperPlane}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

function Header () {
	const router = useRouter()
	return (
		<>
			<Box
				styleSheet={{
					width: '100%',
					marginBottom: '16px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Text
					styleSheet={{ color: appConfig.theme.colors.neutrals['200'] }}
					variant='heading5'>
					Chat
				</Text>
				<Button
					onClick={() => {
						router.push('../')
					}}
					variant='tertiary'
					colorVariant='neutral'
					label='Logout'
					href='/'
				/>
			</Box>
		</>
	)
}

function MessageList (props) {
	function handleDelete (id) {
		props.setMessageList(props.messageList.filter(i => i.id !== id))
	}
	return (
		<Box
			tag='ul'
			styleSheet={{
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column-reverse',
				flex: 1,
				color: appConfig.theme.colors.neutrals['000'],
				marginBottom: '16px',
			}}>
			{props.messageList.map(msg => {
				return (
					<Text
						key={msg.id}
						tag='li'
						styleSheet={{
							flexDirection: 'row',
							borderRadius: '5px',
							padding: '6px',
							marginBottom: '12px',
							hover: {
								backgroundColor: appConfig.theme.colors.neutrals[700],
							},
						}}>
						<Box
							styleSheet={{
								marginBottom: '8px',
							}}>
							<Image
								styleSheet={{
									width: '20px',
									height: '20px',
									borderRadius: '50%',
									display: 'inline-block',
									marginRight: '8px',
								}}
								src={msg.usernameUrl}
							/>
							<Text
								styleSheet={{
									color: appConfig.theme.colors.primary[300],
								}}
								tag='strong'>
								{msg.username}
							</Text>
							<Text
								styleSheet={{
									fontSize: '10px',
									marginLeft: '8px',
									color: appConfig.theme.colors.neutrals[300],
								}}
								tag='span'>
								{new Date().toLocaleDateString()}
							</Text>
							<FontAwesomeIcon
								onClick={() => handleDelete(msg.id)}
								style={{
									marginLeft: '10px',
									cursor: 'pointer',
								}}
								icon={faTrashAlt}
							/>
						</Box>
						{msg.text}
					</Text>
				)
			})}
		</Box>
	)
}
