<template>
	<div class="container">
		<h1 class="pageTitle">Playlists</h1>
		<div class="playlists">
			<div
				class="item"
				v-for="playlist in this.playlists"
				:key="playlist.id"
				@click="showPlaylist(playlist.id)"
			>
				<img class="img" :src="playlist.picture" alt="playlist picture" />
				<div class="txt">
					{{ playlist.title }}
					<span class="creator text-grey">{{ playlist.creator }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			playlists: [],
		};
	},
	created() {
		this.fetchPlaylists();
	},
	methods: {
		fetchPlaylists: async function () {
			await fetch('/playlists')
				.then((res) => res.json())
				.then(
					(d) =>
						(this.playlists = d.data.map((playlist) => ({
							id: playlist.id,
							title: playlist.title,
							picture: playlist.picture_big,
							creator: playlist.user.name,
						})))
				);
		},
		showPlaylist: function (id) {
			this.$router.push(`/playlist/${id}`);
		},
	},
};
</script>

<style scoped>
.container {
	margin: 50px 50px 90px;
}

.pageTitle {
	text-align: left;
}

.playlists {
	padding: 10px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	grid-gap: 30px;
	overflow: auto;
}

.item {
	border-radius: 10px;
	position: relative;
	transition: transform 250ms;
	cursor: pointer;
	overflow: hidden;
}

.item:hover {
	transform: translateY(-2px);
	box-shadow: 4px 4px 10px white;
}

.img {
	max-width: 100%;
}

.txt {
	text-align: center;
	padding: 10px;
	font-weight: bold;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.creator {
	display: block;
	font-style: italic;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
</style>
