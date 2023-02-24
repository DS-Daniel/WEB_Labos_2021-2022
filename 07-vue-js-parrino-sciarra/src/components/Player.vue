<template>
	<div class="player_footer">
		<aside id="player" class="player">
			<div class="player-info-container">
				<div class="player-info" v-if="currentTrack != null">
					<img
						:src="currentTrack.album.cover_small"
						alt="currentTrack cover"
						class="player-info-image"
					/>
					<div>
						<div class="subtitle2">{{ currentTrack.title }}</div>
						<div class="body2">{{ currentTrack.artist.name }}</div>
					</div>
				</div>
			</div>
			<div class="audioPlayerUI">
				<div class="playerButtons">
					<a
						class="button"
						:class="{ isDisabled: currentSong === 0 }"
						@click="prevSong()"
						title="Previous Song"
					>
            <i class="zmdi zmdi-skip-previous"></i>
          </a>
					<a
						class="button play"
						@click="playAudio()"
						title="Play/Pause Song"
					>
						<transition name="slide-fade" mode="out-in">
							<i
								class="zmdi"
								:class="[
									currentlyStopped
										? 'zmdi-stop'
										: currentlyPlaying
										? 'zmdi-pause-circle'
										: 'zmdi-play-circle',
								]"
							></i>
						</transition>
					</a>
					<a
						class="button"
						:class="{ isDisabled: currentSong === musicPlaylist.length - 1 }"
						@click="nextSong()"
						title="Next Song"
					>
						<i class="zmdi zmdi-skip-next"></i>
					</a>
				</div>
				<div class="timing">
					<div class="currentTimeContainer" style="text-align: center">
						<span class="currentTime">{{	currentTime | fancyTimeFormat	}}</span>
						<span class="totalTime">{{ trackDuration | fancyTimeFormat }}</span>
					</div>

					<div class="currentProgressBar">
						<div
							class="currentProgress"
							:style="{ width: currentProgressBar + '%' }"
						></div>
					</div>
				</div>
			</div>
			<Deezer-credits />
		</aside>
	</div>
</template>

<script>
import DeezerCredits from './DeezerCredits.vue';

export default {
	name: 'Player',
	components: { DeezerCredits },
	data() {
		return {
			audio: '',
			currentlyPlaying: false,
			currentlyStopped: false,
			currentTime: 0,
			checkingCurrentPositionInTrack: '',
			trackDuration: 0,
			currentProgressBar: 0,
			currentSong: 0,
		};
	},
	filters: {
		fancyTimeFormat: function (s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
		},
	},
	created() {
		if (this.musicPlaylist.length > 0) {
			this.currentSong = this.musicPlaylist.indexOf(this.currentTrack)
			this.changeSong();
			this.audio.loop = false;
		}
	},
	mounted() {
		this.$root.$on('selectSong', (song) => {
			this.changeSongOnSelection(song);
		});
	},
	computed: {
		currentTrack() {
			return this.$store.state.currentTrack;
		},
		musicPlaylist() {
			return this.$store.state.playlist.tracks;
		},
	},
	methods: {
		nextSong: function () {
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},

		prevSong: function () {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},

		setCurrentSong: function (wasPlaying, song) {
			this.audio = new Audio(song.preview);
			const localThis = this;
			this.audio.addEventListener('loadedmetadata', function () {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener('ended', this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},

		changeSongOnSelection: function (song) {
			const wasPlaying = this.currentlyPlaying;
			this.stopAudio();
			this.currentSong = this.musicPlaylist.indexOf(song);
			this.setCurrentSong(wasPlaying, song);
		},

		changeSong: function (index) {
			const wasPlaying = this.currentlyPlaying;

			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}

			let song = this.musicPlaylist[this.currentSong];
			this.$store.commit('setCurrentTrack', song);
			this.setCurrentSong(wasPlaying, song);
		},

		playAudio: function () {
			if (this.musicPlaylist.length > 0) {
				if (this.currentlyStopped === true &&
					this.currentSong + 1 === this.musicPlaylist.length
				) {
					this.currentSong = 0;
					this.changeSong();
				}
				if (!this.currentlyPlaying) {
					this.getCurrentTimeEverySecond(true);
					if (this.audio === '') {
						this.changeSong();
						this.audio.loop = false;
					}
					this.currentlyPlaying = true;
					this.audio.play();
				} else {
					this.stopAudio();
				}
				this.currentlyStopped = false;
			}
		},

		stopAudio: function () {
			if (this.audio !== '') {
				this.audio.pause();
			}
			this.currentlyPlaying = false;
			this.pausedMusic();
		},

		handleEnded: function () {
			if (this.currentSong + 1 === this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},

		getCurrentTimeEverySecond: function () {
			const localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
				function () {
					localThis.currentTime = localThis.audio.currentTime;
					localThis.currentProgressBar =
						(localThis.audio.currentTime / localThis.trackDuration) * 100;
					localThis.getCurrentTimeEverySecond(true);
				}.bind(this),
				1000
			);
		},

		pausedMusic: function () {
			clearTimeout(this.checkingCurrentPositionInTrack);
		},
	},
	watch: {
		currentTime: function () {
			this.currentTime = Math.round(this.currentTime);
		},
	},
	beforeDestroy: function () {
		if (this.audio !== '') {
			this.audio.removeEventListener('ended', this.handleEnded);
			this.audio.removeEventListener('loadedmetadata', this.handleEnded);
			clearTimeout(this.checkingCurrentPositionInTrack);
		}
	},
};
</script>

<style scoped>
.player_footer {
	width: 100%;
	background-image: none;
	background-repeat: repeat;
	background-attachment: scroll;
	background-position: 0 0;
	position: fixed;
	bottom: 0;
	left: 0;
}

.player {
	background-image: linear-gradient(147deg, #021d68 0%, #9fc3ec 74%);
	border: 1px solid #e7e5eb;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80px;
	width: 100%;
}

.player-info-container {
	flex: 1;
	height: 100%;
}

.player-info {
	height: 100%;
	display: flex;
	align-items: center;
}

.player-info-image {
	height: 100%;
	margin-right: 16px;
}

.audioPlayerUI {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	will-change: transform, filter;
	transition: 0.5s;
	height: 100%;
}

.audioPlayerUI.isDisabled {
	transform: scale(0.75) translateX(100%);
	filter: blur(5px) grayscale(100%);
}

.audioPlayerUI .playerButtons {
	margin-left: 50px;
	margin-top: 10px;
	position: relative;
	text-align: center;
}

.audioPlayerUI .playerButtons .button {
	font-size: 2rem;
	display: inline-block;
	vertical-align: middle;
	padding: 0 0.5rem;
	margin: 0 0.25rem;
	color: rgba(0, 0, 0, 0.75);
	border-radius: 50%;
	outline: 0;
	text-decoration: none;
	cursor: pointer;
	transition: 0.5s;
}

.audioPlayerUI .playerButtons .button.play {
	font-size: 2.5rem;
	margin: 0 1.5rem;
}

.audioPlayerUI .playerButtons .button:active {
	opacity: 0.75;
	transform: scale(0.75);
}

.audioPlayerUI .playerButtons .button.isDisabled {
	color: rgba(0, 0, 0, 0.2);
	cursor: initial;
}

.audioPlayerUI .playerButtons .button.isDisabled:active {
	transform: none;
}

.audioPlayerUI .currentTimeContainer {
	width: 100%;
	height: 1rem;
	display: flex;
	justify-content: space-between;
}

.audioPlayerUI .currentTimeContainer .currentTime,
.audioPlayerUI .currentTimeContainer .totalTime {
	font-size: 0.7rem;
	font-family: monospace;
	color: rgba(0, 0, 0, 0.75);
}

.audioPlayerUI .currentProgressBar {
	width: 100%;
	background-color: rgba(0, 0, 0, 0.1);
}

.audioPlayerUI .currentProgressBar .currentProgress {
	background-color: rgba(0, 0, 0, 0.75);
	width: 0;
	height: 3px;
	transition: 100ms;
}

.timing {
	width: 240px;
	margin-left: 50px;
	margin-bottom: 10px;
}
</style>
