<template>
	<ul class="playlist-songs">
		<li
			class="song"
			v-for="track in tracks"
			:key="track.id"
			@click="play(track)"
		>
			<img
				class="song-img"
				:src="track.album.cover_small"
				alt="track picture"
			/>
			<div class="playBtn">
				<img
					src="https://img.icons8.com/external-icongeek26-outline-gradient-icongeek26/44/000000/external-play-essentials-icongeek26-outline-gradient-icongeek26.png"
					alt="play button"
				/>
			</div>
			<div>
				<div class="subtitle1" :class="{ selected: isCurrentTrack(track.id)}">{{ track.title }}</div>
				<div class="body1">{{ track.artist.name }}</div>
			</div>
		</li>
	</ul>
</template>

<script>
export default {
	name: "TracksList",
	props: ['tracks', 'playlistId'],
	methods: {
		play: function (track) {
			this.$store.commit('setCurrentTrack', track);
			this.$store.commit('setCurrentPlaylist', { id: this.playlistId, tracks: this.tracks });
			this.$root.$emit('selectSong', track);
		},
		isCurrentTrack: function (id) {
			let currentTrack = this.$store.state.currentTrack;
			return currentTrack != null ? currentTrack.id === id : false;
		}
	},
};
</script>

<style scoped>
.playlist-songs {
	list-style: none;
	margin: 0;
	padding: 0 16px;
	height: auto;
}

.song {
	margin-bottom: 26px;
	padding: 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
}

.song:hover {
	background-color: rgba(179, 221, 255, 0.507);
	border-radius: 15px;
}

.song:hover .playBtn {
	display: block;
}

.song-img {
	width: 56px;
	height: 56px;
	border-radius: 10px;
	margin-right: 20px;
}

.playBtn {
	position: absolute;
	display: none;
	width: 56px;
	height: 56px;
	left: 10px;
	padding: 6px;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 10px;
}

.selected {
	color: rgb(255, 0, 0);
}
</style>
