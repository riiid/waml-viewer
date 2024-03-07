import type { ReactEventHandler } from "react";
import React, { useCallback, useMemo } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const Video:WAMLComponent<'Video'> = ({ node, onPlay, onPause, onVolumeChange, ...props }) => {
  const { getURL, logInteraction } = useWAML();

  const url = useMemo(() => getURL(node.value.uri), [ getURL, node.value.uri ]);

  const handlePlay = useCallback<ReactEventHandler<HTMLVideoElement>>(e => {
    onPlay?.(e);
    if(e.defaultPrevented) return;
    const { currentTime, duration } = e.currentTarget;

    logInteraction({ type: "medium-play", url, progress: currentTime / duration });
  }, [ logInteraction, onPlay, url ]);
  const handlePause = useCallback<ReactEventHandler<HTMLVideoElement>>(e => {
    onPause?.(e);
    if(e.defaultPrevented) return;
    const { currentTime, duration } = e.currentTarget;

    logInteraction({ type: "medium-pause", url, progress: currentTime / duration });
  }, [ logInteraction, onPause, url ]);
  const handleVolumeChange = useCallback<ReactEventHandler<HTMLVideoElement>>(e => {
    onVolumeChange?.(e);
    if(e.defaultPrevented) return;
    const { volume, muted } = e.currentTarget;

    logInteraction({ type: "medium-volume-set", url, value: muted ? 0 : volume }, true);
  }, [ logInteraction, onVolumeChange, url ]);

  return <video title={node.value.alt} src={url} controls onPlay={handlePlay} onPause={handlePause} onVolumeChange={handleVolumeChange} {...props} />;
};
Video.displayName = "Video";
export default componentify(Video);