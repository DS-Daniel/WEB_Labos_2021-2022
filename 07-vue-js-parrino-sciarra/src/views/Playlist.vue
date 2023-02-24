<template>
	<section class="content" :style="withPlayer">
		<main class="playlist">
			<router-link class="back" to="/">&lt; Back to playlists</router-link>
			<section class="playlist-info">
				<img :src="img" class="playlist-info-img" />
				<div class="playlist-info-text">
					<div class="body1">Playlist</div>
					<p class="title">{{ title }}</p>
					<div class="body1">By {{ creator }}</div>
					<div class="body1">
						{{ date }} · {{ nbTracks }} songs · {{ duration }} minutes
					</div>
				</div>
			</section>
			<TracksList :tracks="tracks" :playlistId="id" />
		</main>
		<Waiting-queue />
	</section>
</template>

<script>
import WaitingQueue from '../components/WaitingQueue.vue';
import TracksList from '../components/TracksList.vue';

export default {
	name: 'Playlist',
	props: ['id'],
	components: { WaitingQueue, TracksList },
	data() {
		return {
			img: '',
			title: '',
			creator: '',
			date: null,
			nbTracks: null,
			duration: null,
			tracks: [],
		};
	},
	created() {
		this.fetchInfos();
	},
	methods: {
		fetchInfos: async function () {
			await fetch(`/playlists/${this.id}`)
				.then((res) => res.json())
				.then((data) => {
					this.img = data.picture_big;
					this.title = data.title;
					this.creator = data.creator.name;
					this.date = new Date(data.creation_date).getFullYear();
					this.nbTracks = data.nb_tracks;
					this.duration = data.duration;
					this.tracks = data.tracks.data;
				});
		},
	},
	computed: {
		withPlayer() {
			return `height: calc(100% - ${this.$store.state.currentTrack != null ? 80 : 0 }px)`
		}
	}
};
</script>

<style scoped>
.content {
	display: flex;
}

.playlist {
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 30px 86px 0;
	overflow: auto;
}

.back {
	margin: 0 0 20px;
	text-align: left;
	font-size: 18px;
	font-weight: bold;
	text-decoration: none;
	color: inherit;
  z-index: 1;
}

.playlist-info {
	display: flex;
	margin-bottom: 30px;
}

.playlist-info-img {
	height: 250px;
	width: 250px;
	margin-right: 32px;
}

.playlist-info-text {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.playlist-info-text .title {
	margin: 8px 0;
}
</style>
