import {component$} from '@builder.io/qwik'
import {routeAction$, zod$, z, Form} from '@builder.io/qwik-city'
import prismaClient from '~/lib/prismaClient'

export const useCreatQuestion = routeAction$(
	async (data, {params}) => {
		const question = await prismaClient.question.create({
			data: {
				categoryId: +params.categoryId,
				question: data.question
			}
		})

		for(const answer of [
			data.answer1,
      data.answer2,
      data.answer3,
      data.answer4,
      data.answer5,
		].filter(Boolean)){
			await prismaClient.answer.create({
				data:{
					questionId: question.id,
					answer: answer!
				}
			})
		}

		return question
	},

	zod$({
		question: z.string(),
		answer1: z.string().optional(),
    answer2: z.string().optional(),
    answer3: z.string().optional(),
    answer4: z.string().optional(),
    answer5: z.string().optional(),
	})
)

export default component$(() => {
	const createQuestion = useCreatQuestion()

	const contents = (
		<div>
			<h1 class="text-3xl">Create Question</h1>
			<Form action={createQuestion}>
				<label>Question</label>
				<input 
					name='question'
					class='input input-bordered'
					value={createQuestion.formData?.get('question')} 
				/>

				<label>Answer 1</label>
				<input 
					name='answer1'
					class='input input-bordered'
					value={createQuestion.formData?.get('answer1')} 
				/>

				<label>Answer 2</label>
				<input 
					name='answer2'
					class='input input-bordered'
					value={createQuestion.formData?.get('answer2')} 
				/>

				<label>Answer 3</label>
				<input 
					name='answer3'
					class='input input-bordered'
					value={createQuestion.formData?.get('answer3')} 
				/>

				<label>Answer 4</label>
				<input 
					name='answer4'
					class='input input-bordered'
					value={createQuestion.formData?.get('answer4')} 
				/>

				<label>Answer 5</label>
				<input 
					name='answer5'
					class='input input-bordered'
					value={createQuestion.formData?.get('answer5')} 
				/>

				<button 
					class="btn"
					type='submit'
				>
					Create
				</button>
			</Form>

			{createQuestion.value && (
				<div>
					<h2>Question created successfully</h2>
				</div>
			)}
		</div>
	)

	return contents
})