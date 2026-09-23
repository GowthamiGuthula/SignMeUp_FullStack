package com.signmeup.api.service;

import com.signmeup.api.entity.EventCategory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Looks up a photo on the Unsplash public API to use as an event's cover image
 * when the organizer doesn't supply one. Falls back to a curated set of
 * images.unsplash.com photos (keyed by category) when no access key is
 * configured or the API call fails for any reason.
 */
@Service
public class UnsplashService {

    private static final Logger log = LoggerFactory.getLogger(UnsplashService.class);

    private static final Map<EventCategory, String> FALLBACK_IMAGES = Map.of(
            EventCategory.WORKSHOP, "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
            EventCategory.SOCIAL, "https://images.unsplash.com/photo-1506954673998-b077f05b13c7?auto=format&fit=crop&w=1200&q=80",
            EventCategory.COMPETITION, "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
            EventCategory.MEETUP, "https://images.unsplash.com/photo-1758270705290-62b6294dd044?auto=format&fit=crop&w=1200&q=80",
            EventCategory.OTHER, "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80"
    );

    private final RestClient restClient;
    private final String accessKey;

    public UnsplashService(RestClient.Builder restClientBuilder,
                            @Value("${unsplash.access-key:}") String accessKey) {
        this.restClient = restClientBuilder.baseUrl("https://api.unsplash.com").build();
        this.accessKey = accessKey;
    }

    /**
     * Returns a cover image URL for the given event details, searching Unsplash
     * when an access key is configured and always falling back to a static
     * images.unsplash.com photo for the category otherwise.
     */
    public String findImageUrl(EventCategory category, String eventName) {
        String fetched = searchUnsplash(buildQuery(category, eventName));
        if (fetched != null) {
            return fetched;
        }
        return FALLBACK_IMAGES.getOrDefault(category, FALLBACK_IMAGES.get(EventCategory.OTHER));
    }

    private String buildQuery(EventCategory category, String eventName) {
        String categoryTerm = category != null ? category.name().toLowerCase() : "event";
        String name = eventName != null ? eventName : "";
        return (categoryTerm + " " + name).trim();
    }

    private String searchUnsplash(String query) {
        if (accessKey == null || accessKey.isBlank() || query.isBlank()) {
            return null;
        }
        try {
            SearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/search/photos")
                            .queryParam("query", query)
                            .queryParam("per_page", 1)
                            .queryParam("orientation", "landscape")
                            .build())
                    .header("Authorization", "Client-ID " + accessKey)
                    .retrieve()
                    .body(SearchResponse.class);

            if (response == null || response.results() == null || response.results().isEmpty()) {
                return null;
            }
            return response.results().get(0).urls().regular();
        } catch (RuntimeException ex) {
            log.warn("Unsplash lookup failed for query '{}': {}", query, ex.getMessage());
            return null;
        }
    }

    private record SearchResponse(List<Photo> results) {
    }

    private record Photo(Urls urls) {
    }

    private record Urls(String regular) {
    }
}
