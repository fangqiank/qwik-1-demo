import {component$, useComputed$,$,useSignal, useVisibleTask$} from '@builder.io/qwik'
import {routeLoader$, server$} from '@builder.io/qwik-city'
import {useAuthSession} from '~/routes/plugin@auth'
import {type Question} from '@prisma/client'
import { type VoteTally } from '~/types'
import prismaClient from '~/lib/prismaClient'
import { createThankYou } from '~/lib/openai'
import { Answers } from '~/components/answers'

const vote = server$(async (email: string, questionId: number, answerId: number) => {
	await prismaClient.vote.deleteMany({
		where: {email, questionId}
	})

	await prismaClient.vote.create({
		data: {
			email,
			questionId, 
			answerId
		}
	})

	const question = await prismaClient.question.findFirst({
		where: {id: questionId}
	})

	const questions = await prismaClient.question.findMany({
		where: {categoryId: question?.categoryId ?? 0},
		include:{
			answers: true
		}
	})

	const answer = await prismaClient.answer.findFirst({
		where: {id: answerId}
	})

	const votes = await getVotes(questions)

	return {
		votes,
		thankYou: await createThankYou(
			question?.question ?? '',
			answer?.answer ?? ''
		)
	}
})

const getVotes = async (questions: Question[]): Promise<VoteTally[]> => (
	await prismaClient.vote.groupBy({
		where: {questionId : {in: questions.map(q => q.id)}},
		by: ['questionId', 'answerId'],
		_count: {
			answerId: true
		}
	})
).map(({questionId, answerId, _count}) => ({
	questionId,
	answerId,
	count: _count?.answerId ?? 0
}))

export const useQuestions = routeLoader$(async props => {
	// console.log(props)
	const {params, status} = props

	const categoryId = parseInt(params['id'], 10)
	const category = await prismaClient.category.findUnique({
		where: {id: categoryId}
	})
	if(!category) 
		status(404)

	const questions = await prismaClient.question.findMany({
		where: {categoryId: categoryId},
		include: {
			answers: true
		}
	})

	const votes = await getVotes(questions)

	return {questions, votes}
})

export default component$(() => {
	const questions = useQuestions()
	const session = useAuthSession()
	const response = useSignal<string | undefined>()
	const updateVotes = useSignal<VoteTally[]>()

	useVisibleTask$(({track}) => {
		track(() => response.value)

		if(response.value){
			setTimeout(() => {
				response.value = undefined
			}, 3000);
		}
	})

	const onVote = $(async (questionId: number, answerId: number) => {
		const voteResponse = await vote(
			session.value?.user?.email ?? '',
			questionId,
			answerId
		)

		response.value = voteResponse.thankYou
		updateVotes.value = voteResponse.votes
	})

	const voteTallies = useComputed$(() => updateVotes.value ?? questions.value?.votes ?? [])

	const contents = (
		<>
			{response.value && (
				<div class="toast toast-top toast-end">
					<div class="alert alert-success">
						<div>
							<span>{response.value}</span>
						</div>
					</div>
				</div>
			)}

			{questions.value?.questions.map(question => (
				<div 
					class="mt-3 mb-6"
					key={question.id}
				>
					<div class="text-2xl font-bold mb-3">{question.question}</div>
					<Answers
						question={question}
						answers={question.answers}
						voteTallies={voteTallies}
						loggedIn={!!session.value?.user}
						onVote$={onVote} 
					/>
				</div>
			))}
		</>
	)

	return contents
})

