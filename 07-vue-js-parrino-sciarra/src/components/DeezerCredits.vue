<template>
	<div class="player-logo">
		<div class="player-logo-container">
			<div class="overline">Powered by</div>
			<img
				src="@/assets/logo.png"
				alt="Deezer logo"
				class="player-logo-img"
			/>
		</div>
	</div>
</template>

<style scoped>
.player-logo {
	flex: 1;
	display: flex;
	justify-content: flex-end;
}

.player-logo-container {
	padding-right: 16px;
}

.player-logo-img {
	height: 30px;
}
</style>
