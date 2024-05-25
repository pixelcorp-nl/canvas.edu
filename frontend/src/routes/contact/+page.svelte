<script lang="ts">
	const contributors = [
		{
			name: 'Oswin',
			avatar: '/images/oswin.webp',
			github: 'https://github.com/Obult'
		},
		{
			name: 'Mees',
			avatar: 'https://avatars.githubusercontent.com/u/47971836?v=4',
			github: 'https://github.com/LithiumOx'
		},
		{
			name: 'Joppe',
			avatar: '/images/joppe.webp',
			github: 'https://github.com/SirMorfield'
		}
	]
</script>

<section class="">
	<div class="mx-auto max-w-screen-xl px-4 lg:flex lg:items-center">
		<div class="mx-auto max-w-xl text-center">
			<h1 class="text-3xl font-extrabold sm:text-5xl">
				<strong class="font-extrabold text-[#f2ac93] sm:block"> Contact </strong>
			</h1>

			<!-- <p class="mt-4 sm:text-xl/relaxed">We make programming exciting...</p> -->
		</div>
	</div>
	<div class="mx-auto max-w-screen-xl px-4 py-16">
		<div class="mx-auto">
			<h2 class="text-xl font-extrabold sm:text-xl">Our journey</h2>
			<p>
				We started this project during our studies at Codam because we believe strongly that the best way to learn is by doing.<br />
				We wanted to create a platform where people can learn programming in a fun and interactive way.<br /><br />
			</p>
			<p>
				Our focus with the platform is highschool students because we believe that programming is a skill that will be very important in the future.<br />
				During our own highschool years we had quite a different experience with the school provided resources.<br />
				We wanted to create a platform that is more engaging and fun to use.<br /><br />
			</p>
			<p>
				There are a lot of features we would like to add and we will keep inproving the platform.<br />
				Our goal for the next year is to make the platform ready for use in schools.<br />
				We hope you enjoy using our platform as much as we enjoyed creating it.<br />
			</p>
		</div>
		<div class="mx-auto py-16">
			<h2 class="text-xl font-extrabold sm:text-xl">Created by</h2>
			<div class="flex gap-5">
				{#each contributors as contributor}
					<a
						href={contributor.github}
						class="flex flex-col items-center gap-3 bg-gray-200 p-2 rounded-lg shadow-lg hover:scale-[99%] hover:shadow-md transition-all duration-300 hover:bg-gray-100">
						<img src={contributor.avatar} class="h-32 w-32 mt-2 mx-2 rounded-full object-cover" alt="" />
						<p class="text-lg font-bold">{contributor.name}</p>
					</a>
				{/each}
			</div>
		</div>
		<div class="mx-auto">
			<h2 class="text-xl font-extrabold sm:text-xl">Mail us!</h2>
			<p>info<span style="display:none">foo</span>@pixel<span style="display:none">s</span>corp.nl</p>
		</div>
	</div>
	<div class="mx-auto max-w-screen-xl px-4 lg:flex lg:items-center" />
</section>
