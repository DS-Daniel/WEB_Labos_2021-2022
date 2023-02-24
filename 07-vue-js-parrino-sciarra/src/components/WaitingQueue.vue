<template>
	<aside id="queue" class="queue-container">
		<div class="info body1">Queue · {{ nbTracks }} tracks</div>
		<div v-if="nbTracks === 0" class="empty-queue">
			<p class="body1 text-grey">This queue is empty</p>
		</div>
		<div v-else>
			<TracksList :tracks="currentPlaylist" :playlistId="playlistId" />
		</div>
	</aside>
</template>

<script>
import TracksList from './TracksList.vue';

export default {
	name: "WaitingQueue",
	components: { TracksList },
	computed: {
		playlistId() {
			return this.$store.state.playlist.id;
		},
		currentPlaylist() {
			return this.$store.state.playlist.tracks;
		},
		nbTracks() {
			return this.$store.state.playlist.tracks.length;
		},
	},
};
</script>

<style scoped>
.queue-container {
	background-color: #000000;
	background-image: linear-gradient(147deg, #021d68 0%, #9fc3ec 74%);
	width: 330px;
	padding: 32px;
	position: relative;
	overflow: auto;
}

.info {
	margin-bottom: 1rem;
}

.empty-queue {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
