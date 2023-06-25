<script lang="ts">
	const contributors = [
		{
			name: 'Obult',
			avatar: 'https://avatars.githubusercontent.com/u/69460150?v=4',
			github: 'https://github.com/Obult'
		},
		{
			name: 'LithiumOx',
			avatar: 'https://avatars.githubusercontent.com/u/47971836?v=4',
			github: 'https://github.com/LithiumOx'
		},
		{
			name: 'SirMorfield',
			avatar: 'https://avatars.githubusercontent.com/u/31915428?v=4',
			github: 'https://github.com/SirMorfield'
		}
	]
</script>

<section class="">
	<div class="mx-auto max-w-screen-xl px-4 py-24 lg:flex lg:items-center">
		<div class="mx-auto max-w-xl text-center">
			<h1 class="text-3xl font-extrabold sm:text-5xl">
				Learn programming together.
				<strong class="font-extrabold text-[#f2ac93] sm:block"> Improve together. </strong>
			</h1>

			<!-- <p class="mt-4 sm:text-xl/relaxed">We make programming exciting...</p> -->

			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<!-- <a
					class="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
					href="/get-started">
					Log in
				</a>

				<a
					class="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
					href="/about">
					Learn More
				</a> -->
			</div>
		</div>
	</div>
</section>
<!-- <img src="/images/example.gif" alt="example" class="mx-auto w-full max-w-screen-sm mb-20 rounded-lg" /> -->
<section>
	<div class="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
		<div class="mx-auto max-w-xl text-center">
			<h1 class="text-2xl font-extrabold sm:text-5xl mb-10">
				Made by:
				<strong class="font-extrabold text-[#f2ac93] sm:block" />
			</h1>
			<div class="flex gap-5">
				{#each contributors as contributor}
					<a
						href={contributor.github}
						class="flex flex-col items-center gap-3 bg-gray-200 p-2 rounded-lg shadow-lg hover:scale-[99%] hover:shadow-md transition-all duration-300 hover:bg-gray-100">
						<img src={contributor.avatar} class="h-32 w-32 mt-2 mx-2 rounded-full" alt="" />
						<p class="text-lg font-bold">{contributor.name}</p>
					</a>
				{/each}
			</div>

			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<!-- <a
					class="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
					href="/get-started">
					Log in
				</a>

				<a
					class="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
					href="/about">
					Learn More
				</a> -->
			</div>
		</div>
	</div>
</section>
